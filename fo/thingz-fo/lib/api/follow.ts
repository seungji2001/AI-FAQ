import { apiClient } from "./client";

export async function followUser(followingId: string): Promise<void> {
  return apiClient.post(`/users/${followingId}/follow`, {});
}

export async function unfollowUser(followingId: string): Promise<void> {
  return apiClient.delete(`/users/${followingId}/follow`);
}
