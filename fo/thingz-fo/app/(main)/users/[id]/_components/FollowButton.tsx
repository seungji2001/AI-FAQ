"use client";

import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { BRAND_COLOR, BRAND_COLOR_HOVER } from "@/lib/constants/theme";
import { fs, fw, dim } from "@/lib/styles/typography";
import { tokenStorage } from "@/lib/auth/token";
import { followUser, unfollowUser, checkIsFollowing } from "@/lib/api/follow";
import LoginDialog from "@/app/components/LoginDialog";
import { useT } from "@/lib/i18n/context";

interface Props { userId: string }

export default function FollowButton({ userId }: Props) {
  const t = useT();
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
      if (following) { await unfollowUser(userId); setFollowing(false); }
      else { await followUser(userId); setFollowing(true); }
    } catch {
      alert(following ? t.article.unfollowFailed : t.article.followFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
      <Button size="small" variant={following ? "outlined" : "contained"} disableElevation disabled={loading} onClick={handleClick}
        sx={{ flexShrink: 0, fontSize: fs.sm, fontWeight: fw.bold, borderRadius: dim.radiusPill, minWidth: dim.followBtnMinW, height: dim.followBtnHeight, backgroundColor: following ? undefined : BRAND_COLOR, borderColor: following ? BRAND_COLOR : undefined, color: following ? BRAND_COLOR : "white", "&:hover": { backgroundColor: following ? undefined : BRAND_COLOR_HOVER } }}
      >
        {following ? t.article.following : t.article.follow}
      </Button>
    </>
  );
}
