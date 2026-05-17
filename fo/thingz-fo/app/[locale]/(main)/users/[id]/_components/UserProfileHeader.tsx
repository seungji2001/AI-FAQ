"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { fs, fw, textSecondary } from "@/lib/styles/typography";
import { UserProfile } from "@/lib/types/user";
import FollowButton from "./FollowButton";
import { useT } from "@/lib/i18n/context";

interface Props {
  user: UserProfile;
  articleCount: number;
}

export default function UserProfileHeader({ user, articleCount }: Props) {
  const t = useT();
  const [followerCount, setFollowerCount] = useState(user.followerCount);

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
          @{user.username} · {t.users.articles} {articleCount} · {t.article.followers} {followerCount.toLocaleString()}
        </Typography>
        {user.bio && (
          <Typography sx={{ fontSize: fs.sm, mt: 0.5 }}>{user.bio}</Typography>
        )}
      </Box>
      <FollowButton userId={user.id} onFollowChange={(delta) => setFollowerCount((c) => Math.max(0, c + delta))} />
    </Box>
  );
}
