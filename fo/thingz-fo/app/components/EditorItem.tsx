"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { BRAND_COLOR, BRAND_COLOR_HOVER } from "@/lib/constants/theme";
import { fs, fw, dim, labelBold, captionText } from "@/lib/styles/typography";

interface EditorItemProps {
  username?: string;
  followers?: string;
  articles?: number;
  avatarSrc?: string;
  following?: boolean;
}

export default function EditorItem({
  username = "@minimal_jungsoo",
  followers = "1.2k",
  articles = 34,
  avatarSrc,
  following = false,
}: EditorItemProps) {
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
