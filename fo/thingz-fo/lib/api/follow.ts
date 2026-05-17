import { apiClient } from "./client";
import { UserItem } from "@/lib/types/user";

export async function followUser(followingId: string): Promise<void> {
  return apiClient.post(`/users/${followingId}/follow`, {});
}

export async function unfollowUser(followingId: string): Promise<void> {
  return apiClient.delete(`/users/${followingId}/follow`);
}

export async function checkIsFollowing(userId: string): Promise<boolean> {
  const res = await apiClient.get<{ following: boolean }>(`/users/${userId}/is-following`);
  return res.following;
}

export async function fetchFollowing(): Promise<UserItem[]> {
  return apiClient.get<UserItem[]>("/users/me/following");
}

export async function fetchFollowers(userId: string): Promise<UserItem[]> {
  return apiClient.get<UserItem[]>(`/users/${userId}/followers`);
}

export async function fetchFollowingByUser(userId: string): Promise<UserItem[]> {
  return apiClient.get<UserItem[]>(`/users/${userId}/following`);
}
