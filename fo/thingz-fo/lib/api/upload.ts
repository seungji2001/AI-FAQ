import { apiClient } from "./client";

interface PresignResponse {
  presignedUrl: string;
  fileUrl: string;
}

export async function getPresignedUrl(fileName: string, contentType: string): Promise<PresignResponse> {
  return apiClient.post<PresignResponse>("/upload/presign", { fileName, contentType });
}

export async function uploadToS3(presignedUrl: string, file: File): Promise<void> {
  const res = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  if (!res.ok) throw new Error(`S3 업로드 실패: ${res.status}`);
}

export async function uploadImage(file: File): Promise<string> {
  const { presignedUrl, fileUrl } = await getPresignedUrl(file.name, file.type);
  await uploadToS3(presignedUrl, file);
  return fileUrl;
}
