"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { BRAND_COLOR, BRAND_COLOR_HOVER } from "@/lib/constants/theme";
import { fs, fw, dim, labelBold, captionText } from "@/lib/styles/typography";
import { followUser, unfollowUser } from "@/lib/api/follow";
import { tokenStorage } from "@/lib/auth/token";
import { useT } from "@/lib/i18n/context";
import { useToast } from "@/app/components/ui/Toast";

interface EditorItemProps {
  userId?: string;
  username?: string;
  followers?: string;
  articles?: number;
  avatarSrc?: string;
  following?: boolean;
  onLoginRequired?: () => void;
}

export default function EditorItem({
  userId, username = "@minimal_jungsoo", followers = "1.2k", articles = 34,
  avatarSrc, following: initialFollowing = false, onLoginRequired,
}: EditorItemProps) {
  const t = useT();
  const toast = useToast();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    if (!tokenStorage.getAccessToken()) { onLoginRequired?.(); return; }
    if (!userId || loading) return;
    setLoading(true);
    try {
      if (following) { await unfollowUser(userId); setFollowing(false); }
      else { await followUser(userId); setFollowing(true); }
    } catch {
      setFollowing(following);
      toast.error(following ? t.article.unfollowFailed : t.article.followFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Avatar src={avatarSrc} sx={{ width: dim.avatarSize, height: dim.avatarSize, bgcolor: "grey.200", flexShrink: 0 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={labelBold}>{username}</Typography>
        <Typography sx={captionText}>{t.article.followers} {followers} · {t.article.articles} {articles}</Typography>
      </Box>
      <Button size="small" variant={following ? "outlined" : "contained"} disableElevation disabled={loading} onClick={handleFollow}
        sx={{
          flexShrink: 0, fontSize: fs.sm, fontWeight: fw.bold, borderRadius: dim.radiusPill,
          minWidth: dim.followBtnMinW, height: dim.followBtnHeight,
          backgroundColor: following ? undefined : BRAND_COLOR,
          borderColor: following ? BRAND_COLOR : undefined,
          color: following ? BRAND_COLOR : "white",
          "&:hover": { backgroundColor: following ? undefined : BRAND_COLOR_HOVER },
        }}
      >
        {following ? t.article.following : t.article.follow}
      </Button>
    </Box>
  );
}
