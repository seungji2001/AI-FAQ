"use client";

import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { btnFollow } from "@/lib/styles/typography";
import { tokenStorage } from "@/lib/auth/token";
import { followUser, unfollowUser, checkIsFollowing } from "@/lib/api/follow";
import LoginDialog from "@/app/components/LoginDialog";
import { useT } from "@/lib/i18n/context";
import { useToast } from "@/app/components/ui/Toast";

interface Props {
  userId: string;
  onFollowChange?: (delta: 1 | -1) => void;
}

export default function FollowButton({ userId, onFollowChange }: Props) {
  const t = useT();
  const toast = useToast();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (!token) return;
    import("@/lib/auth/token").then(({ getUserFromToken }) => {
      const me = getUserFromToken(token);
      if (me?.userId === userId) { setIsOwner(true); return; }
      checkIsFollowing(userId).then(setFollowing).catch(() => {});
    });
  }, [userId]);

  if (isOwner) return null;

  const handleClick = async () => {
    if (!tokenStorage.getAccessToken()) { setLoginOpen(true); return; }
    if (loading) return;
    setLoading(true);
    try {
      if (following) {
        await unfollowUser(userId);
        setFollowing(false);
        onFollowChange?.(-1);
      } else {
        await followUser(userId);
        setFollowing(true);
        onFollowChange?.(1);
      }
    } catch {
      toast.error(following ? t.article.unfollowFailed : t.article.followFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
      <Button
        size="small"
        variant={following ? "outlined" : "contained"}
        color="primary"
        disableElevation
        disabled={loading}
        onClick={handleClick}
        sx={btnFollow}
      >
        {following ? t.article.following : t.article.follow}
      </Button>
    </>
  );
}
