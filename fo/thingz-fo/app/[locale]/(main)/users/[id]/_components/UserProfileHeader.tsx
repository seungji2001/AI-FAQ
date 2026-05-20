"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { fs, fw, textSecondary, titleMd } from "@/lib/styles/typography";
import { panelBase } from "@/lib/styles/sx";
import { UserProfile, UserItem } from "@/lib/types/user";
import { fetchFollowers } from "@/lib/api/follow";
import FollowButton from "./FollowButton";
import EditorItem from "@/app/components/EditorItem";
import { useT } from "@/lib/i18n/context";

interface Props {
  user: UserProfile;
  articleCount: number;
}

export default function UserProfileHeader({ user, articleCount }: Props) {
  const t = useT();
  const [followerCount, setFollowerCount] = useState(user.followerCount);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followers, setFollowers] = useState<UserItem[]>([]);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [followersLoaded, setFollowersLoaded] = useState(false);

  const openFollowers = async () => {
    setFollowersOpen(true);
    if (followersLoaded) return;
    setFollowersLoading(true);
    try {
      const data = await fetchFollowers(user.id);
      setFollowers(data);
      setFollowersLoaded(true);
    } finally {
      setFollowersLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
      <Avatar
        src={user.avatarUrl ?? undefined}
        sx={{ width: 64, height: 64, bgcolor: "grey.300", fontSize: fs["3xl"], fontWeight: fw.bold }}
      >
        {user.username[0]?.toUpperCase()}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: fs["2xl"], fontWeight: fw.bold }}>
          {user.displayName || user.username}
        </Typography>
        <Typography sx={textSecondary}>
          @{user.username} · {t.users.articles} {articleCount} · {" "}
          <Box
            component="span"
            onClick={openFollowers}
            sx={{ cursor: "pointer", "&:hover": { color: "text.primary" } }}
          >
            {t.article.followers} {followerCount.toLocaleString()}
          </Box>
        </Typography>
        {user.bio && (
          <Typography sx={{ fontSize: fs.sm, mt: 0.5 }}>{user.bio}</Typography>
        )}
      </Box>
      <FollowButton userId={user.id} onFollowChange={(delta) => { setFollowerCount((c) => Math.max(0, c + delta)); setFollowersLoaded(false); }} />

      {/* 팔로워 다이얼로그 */}
      <Dialog open={followersOpen} onClose={() => setFollowersOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={titleMd}>{t.article.followers}</DialogTitle>
        <DialogContent>
          {followersLoading ? (
            <Typography sx={textSecondary}>불러오는 중...</Typography>
          ) : followers.length === 0 ? (
            <Typography sx={textSecondary}>팔로워가 없습니다.</Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, pt: 1 }}>
              {followers.map((u) => (
                <Box key={u.id} sx={{ ...panelBase, p: 1.5 }}>
                  <EditorItem
                    userId={u.id}
                    username={`@${u.username}`}
                    followers={String(u.followerCount)}
                    articles={u.articleCount}
                    avatarSrc={u.avatarUrl ?? undefined}
                  />
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setFollowersOpen(false)} sx={{ fontSize: fs.sm }}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
