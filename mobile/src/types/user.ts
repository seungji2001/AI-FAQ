export interface UserItem {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  articleCount: number;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  instagramId: string | null;
  kakaoUrl: string | null;
  articleCount: number;
  followerCount: number;
}
