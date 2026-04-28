import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EditorItem from "@/app/components/EditorItem";
import { panelBase, cardImage } from "@/lib/styles/sx";
import { captionText } from "@/lib/styles/typography";

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
    <Box sx={{ ...panelBase, overflow: "hidden" }}>
      <Box
        sx={{
          ...cardImage,
          aspectRatio: "16/5",
          backgroundImage: coverSrc ? `url(${coverSrc})` : undefined,
        }}
      />
      <Box sx={{ px: 3, pt: 2, pb: 3, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <EditorItem
          username={username}
          followers={followers}
          articles={articles}
          avatarSrc={avatarSrc}
          following={following}
        />
        <Typography sx={{ ...captionText, pl: 0.5 }}>
          {bio}
        </Typography>
      </Box>
    </Box>
  );
}
