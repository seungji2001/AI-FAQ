import { api } from '../network/APIClient';

interface PresignResponse {
  presignedUrl: string;
  fileUrl: string;
}

export const UploadService = {
  async getPresignedUrl(fileName: string, contentType: string): Promise<PresignResponse> {
    return api.post<PresignResponse>('/api/fo/upload/presign', { fileName, contentType });
  },

  async uploadToS3(presignedUrl: string, uri: string, contentType: string, onProgress?: (pct: number) => void): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const res = await fetch(uri);
      const blob = await res.blob();

      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
      xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`S3 업로드 실패: ${xhr.status}`)));
      xhr.onerror = () => reject(new Error('S3 업로드 오류'));
      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', contentType);
      xhr.send(blob);
    });
  },

  async uploadImage(uri: string, fileName: string, contentType: string, onProgress?: (pct: number) => void): Promise<string> {
    const { presignedUrl, fileUrl } = await this.getPresignedUrl(fileName, contentType);
    await this.uploadToS3(presignedUrl, uri, contentType, onProgress);
    return fileUrl;
  },
};
