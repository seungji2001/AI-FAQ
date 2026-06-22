"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import { dim, labelBold, captionText, btnFollow } from "@/lib/styles/typography";
import { followUser, unfollowUser, checkIsFollowing } from "@/lib/api/follow";
import { tokenStorage, getUserFromToken } from "@/lib/auth/token";
import { useT } from "@/lib/i18n/context";
import { useToast } from "@/app/components/ui/Toast";

interface EditorItemProps {
  userId?: string;
  username?: string;
  followers?: string;
  articles?: number;
  avatarSrc?: string;
  onLoginRequired?: () => void;
}

export default function EditorItem({
  userId, username = "@minimal_jungsoo", followers = "1.2k", articles = 34,
  avatarSrc, onLoginRequired,
}: EditorItemProps) {
  const t = useT();
  const toast = useToast();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [checked, setChecked] = useState(false);
  const [followerCount, setFollowerCount] = useState(() => parseInt(followers.replace(/,/g, ""), 10) || 0);

  useEffect(() => {
    if (!userId) { setChecked(true); return; }
    const token = tokenStorage.getAccessToken();
    if (!token) { setChecked(true); return; }
    const me = getUserFromToken(token);
    if (me?.userId === userId) {
      setIsOwner(true);
      setChecked(true);
      return;
    }
    let cancelled = false;
    checkIsFollowing(userId)
      .then((val) => { if (!cancelled) setFollowing(val); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setChecked(true); });
    return () => { cancelled = true; };
  }, [userId]);

  if (isOwner) return null;

  const handleFollow = async () => {
    if (!tokenStorage.getAccessToken()) { onLoginRequired?.(); return; }
    if (!userId || loading) return;
    setLoading(true);
    try {
      if (following) {
        await unfollowUser(userId);
        setFollowing(false);
        setFollowerCount((c) => Math.max(0, c - 1));
      } else {
        await followUser(userId);
        setFollowing(true);
        setFollowerCount((c) => c + 1);
      }
    } catch {
      toast.error(following ? t.article.unfollowFailed : t.article.followFailed);
    } finally {
      setLoading(false);
    }
  };

  const displayFollowers = followerCount >= 1000
    ? `${(followerCount / 1000).toFixed(1)}k`
    : String(followerCount);

  const profileHref = userId ? `/users/${userId}` : undefined;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      {profileHref ? (
        <Link href={profileHref} style={{ flexShrink: 0 }}>
          <Avatar src={avatarSrc} sx={{ width: dim.avatarSize, height: dim.avatarSize, cursor: "pointer", "&:hover": { opacity: 0.8 }, transition: "opacity 0.15s" }} />
        </Link>
      ) : (
        <Avatar src={avatarSrc} sx={{ width: dim.avatarSize, height: dim.avatarSize, flexShrink: 0 }} />
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {profileHref ? (
          <Link href={profileHref} style={{ textDecoration: "none", display: "block", minWidth: 0 }}>
            <Typography
              sx={{
                ...labelBold,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                "&:hover": { opacity: 0.7 },
                transition: "opacity 0.15s",
              }}
            >
              {username}
            </Typography>
          </Link>
        ) : (
          <Typography sx={{ ...labelBold, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {username}
          </Typography>
        )}
        <Typography sx={captionText}>{t.article.followers} {displayFollowers} · {t.article.articles} {articles}</Typography>
      </Box>
      {checked && (
        <Button
          size="small"
          variant={following ? "outlined" : "contained"}
          color="primary"
          disableElevation
          disabled={loading}
          onClick={handleFollow}
          sx={btnFollow}
        >
          {following ? t.article.following : t.article.follow}
        </Button>
      )}
    </Box>
  );
}
