import { apiClient } from "./client";
import { UserItem } from "@/lib/types/user";

export async function fetchUsers(): Promise<UserItem[]> {
  return apiClient.get<UserItem[]>("/users");
}
