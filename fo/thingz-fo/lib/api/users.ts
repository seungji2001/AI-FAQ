import { apiClient } from "./client";
import { UserItem, UserProfile, UserUpdateRequest } from "@/lib/types/user";

export async function fetchUsers(): Promise<UserItem[]> {
  return apiClient.get<UserItem[]>("/users");
}

export async function fetchUser(id: string): Promise<UserProfile> {
  return apiClient.get<UserProfile>(`/users/${id}`);
}

export async function updateMyProfile(body: UserUpdateRequest): Promise<void> {
  return apiClient.put("/users/me", body);
}
