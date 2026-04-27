"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

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
      <Avatar
        src={avatarSrc}
        sx={{ width: 48, height: 48, bgcolor: "grey.200", flexShrink: 0 }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary" }}>
          {username}
        </Typography>
        <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
          팔로워 {followers} · 아티클 {articles}
        </Typography>
      </Box>
      <Button
        size="small"
        variant={following ? "outlined" : "contained"}
        disableElevation
        sx={{
          flexShrink: 0,
          fontSize: "12px",
          fontWeight: 700,
          borderRadius: "20px",
          minWidth: 56,
          height: 28,
          backgroundColor: following ? undefined : "#FBA96E",
          borderColor: following ? "#FBA96E" : undefined,
          color: following ? "#FBA96E" : "white",
          "&:hover": {
            backgroundColor: following ? undefined : "#f99a58",
          },
        }}
      >
        {following ? "팔로잉" : "팔로우"}
      </Button>
    </Box>
  );
}
