import { apiClient } from "./client";
import { UserItem, UserProfile, UserUpdateRequest } from "@/lib/types/user";

export async function fetchUsers(): Promise<UserItem[]> {
  return apiClient.get<UserItem[]>("/users");
}

export async function fetchMyProfile(): Promise<UserProfile> {
  return apiClient.get<UserProfile>("/users/me");
}

export async function fetchUser(id: string): Promise<UserProfile> {
  return apiClient.get<UserProfile>(`/users/${id}`);
}

export async function updateMyProfile(body: UserUpdateRequest): Promise<void> {
  return apiClient.put("/users/me", body);
}

export async function updateMyAvatar(avatarUrl: string): Promise<void> {
  return apiClient.patch("/users/me/avatar", { avatarUrl });
}
