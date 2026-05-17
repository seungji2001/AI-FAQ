import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import EditorItem from "@/app/components/EditorItem";
import { fs, fw } from "@/lib/styles/typography";

interface ArticleEditorProfileProps {
  userId?: string;
  username?: string;
  bio?: string;
  articles?: number;
  followers?: string;
  avatarSrc?: string;
  onLoginRequired?: () => void;
}

export default function ArticleEditorProfile({
  userId, username = "@film_essay_kim",
  bio = "필름 카메라와 아날로그 라이프스타일을 사랑합니다 📷",
  articles = 34, followers = "1.2k", avatarSrc, onLoginRequired,
}: ArticleEditorProfileProps) {
  return (
    <Box sx={{ borderTop: "1px solid", borderColor: "grey.200", pt: 3 }}>
      <Typography sx={{ fontSize: fs.sm, fontWeight: fw.semibold, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.08em", mb: 2 }}>
        Written by
      </Typography>
      <EditorItem
        userId={userId} username={username} followers={followers}
        articles={articles} avatarSrc={avatarSrc}
        onLoginRequired={onLoginRequired}
      />
      {bio && (
        <Typography sx={{ fontSize: fs.md, color: "text.secondary", mt: 1.5, lineHeight: 1.6, pl: 0.5 }}>
          {bio}
        </Typography>
      )}
    </Box>
  );
}
