import { apiClient } from "./client";

interface PresignResponse {
  presignedUrl: string;
  fileUrl: string;
}

export async function getPresignedUrl(fileName: string, contentType: string): Promise<PresignResponse> {
  return apiClient.post<PresignResponse>("/upload/presign", { fileName, contentType });
}

export async function uploadToS3(presignedUrl: string, file: File, onProgress?: (pct: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => xhr.status < 300 ? resolve() : reject(new Error(`S3 업로드 실패: ${xhr.status}`));
    xhr.onerror = () => reject(new Error("S3 업로드 오류"));
    xhr.open("PUT", presignedUrl);
    xhr.send(file);
  });
}

export async function uploadImage(file: File, onProgress?: (pct: number) => void): Promise<string> {
  const { presignedUrl, fileUrl } = await getPresignedUrl(file.name, file.type);
  await uploadToS3(presignedUrl, file, onProgress);
  return fileUrl;
}
