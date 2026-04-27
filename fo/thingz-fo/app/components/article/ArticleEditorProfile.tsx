"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EditorItem from "../EditorItem";

interface ArticleEditorProfileProps {
  username?: string;
  bio?: string;
  articles?: number;
  followers?: string;
  avatarSrc?: string;
  coverSrc?: string;
  following?: boolean;
}

export default function ArticleEditorProfile({
  username = "@film_essay_kim",
  bio = "필름 카메라와 아날로그 라이프스타일을 사랑합니다 📷",
  articles = 34,
  followers = "1.2k",
  avatarSrc,
  coverSrc,
  following = false,
}: ArticleEditorProfileProps) {
  return (
    <Box sx={{ bgcolor: "white", borderRadius: 3, boxShadow: 1, overflow: "hidden" }}>
      {/* 커버 이미지 */}
      <Box
        sx={{
          width: "100%",
          aspectRatio: "16/5",
          bgcolor: "grey.300",
          backgroundImage: coverSrc ? `url(${coverSrc})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Box sx={{ px: 3, pt: 2, pb: 3, display: "flex", flexDirection: "column", gap: 1.5 }}>
        {/* EditorItem 재활용: 아바타 + 유저명 + 팔로워 + 팔로우 버튼 */}
        <EditorItem
          username={username}
          followers={followers}
          articles={articles}
          avatarSrc={avatarSrc}
          following={following}
        />

        {/* bio */}
        <Typography sx={{ fontSize: "12px", color: "text.secondary", pl: 0.5 }}>
          {bio}
        </Typography>
      </Box>
    </Box>
  );
}
