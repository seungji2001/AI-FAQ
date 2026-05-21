import { api } from '../network/APIClient';
import { UserItem, UserProfile } from '../../types/user';

const BASE = '/api/fo';

export const UserService = {
  fetchAll: () => api.get<UserItem[]>(`${BASE}/users`),
  fetchMe: () => api.get<UserProfile>(`${BASE}/users/me`),
  fetchOne: (id: string) => api.get<UserProfile>(`${BASE}/users/${id}`),
  updateMe: (body: Partial<{ displayName: string; bio: string; instagramId: string; kakaoUrl: string }>) =>
    api.put(`${BASE}/users/me`, body),
  updateAvatar: (avatarUrl: string) => api.patch(`${BASE}/users/me/avatar`, { avatarUrl }),
  follow: (id: string) => api.post(`${BASE}/users/${id}/follow`, {}),
  unfollow: (id: string) => api.delete(`${BASE}/users/${id}/follow`),
  checkFollowing: (id: string) => api.get<{ following: boolean }>(`${BASE}/users/${id}/is-following`),
  fetchFollowing: () => api.get<UserItem[]>(`${BASE}/users/me/following`),
};
