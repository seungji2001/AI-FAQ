export interface UserItem {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  articleCount: number;
  followerCount: number;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  instagramId: string | null;
  kakaoUrl: string | null;
  articleCount: number;
  followerCount: number;
  followingCount: number;
}

export interface UserUpdateRequest {
  displayName?: string;
  bio?: string;
  instagramId?: string;
  kakaoUrl?: string;
}
