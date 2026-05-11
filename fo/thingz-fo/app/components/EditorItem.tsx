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
  userId,
  username = "@minimal_jungsoo",
  followers = "1.2k",
  articles = 34,
  avatarSrc,
  following: initialFollowing = false,
  onLoginRequired,
}: EditorItemProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    if (!tokenStorage.getAccessToken()) {
      onLoginRequired?.();
      return;
    }
    if (!userId || loading) return;
    setLoading(true);
    try {
      if (following) {
        await unfollowUser(userId);
        setFollowing(false);
      } else {
        await followUser(userId);
        setFollowing(true);
      }
    } catch {
      // 실패 시 상태 유지
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Avatar src={avatarSrc} sx={{ width: dim.avatarSize, height: dim.avatarSize, bgcolor: "grey.200", flexShrink: 0 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={labelBold}>{username}</Typography>
        <Typography sx={captionText}>팔로워 {followers} · 아티클 {articles}</Typography>
      </Box>
      <Button
        size="small"
        variant={following ? "outlined" : "contained"}
        disableElevation
        disabled={loading}
        onClick={handleFollow}
        sx={{
          flexShrink: 0,
          fontSize: fs.sm,
          fontWeight: fw.bold,
          borderRadius: "20px",
          minWidth: dim.followBtnMinW,
          height: dim.followBtnHeight,
          backgroundColor: following ? undefined : BRAND_COLOR,
          borderColor: following ? BRAND_COLOR : undefined,
          color: following ? BRAND_COLOR : "white",
          "&:hover": { backgroundColor: following ? undefined : BRAND_COLOR_HOVER },
        }}
      >
        {following ? "팔로잉" : "팔로우"}
      </Button>
    </Box>
  );
}
