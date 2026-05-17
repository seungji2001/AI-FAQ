import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import EditorItem from "./EditorItem";
import { UserItem } from "@/lib/types/user";
import { fs, fw, textSecondary } from "@/lib/styles/typography";

interface TodayEditorsProps {
  users?: UserItem[];
  title?: string;
}

export default function TodayEditors({ users, title = "오늘의 에디터" }: TodayEditorsProps) {
  const editors = (users ?? []).slice(0, 5).map((u) => ({
    userId: u.id,
    username: `@${u.username}`,
    followers: String(u.articleCount),
    articles: u.articleCount,
    avatarSrc: u.avatarUrl ?? undefined,
  }));

  return (
    <Box>
      <Typography sx={{ fontSize: fs.sm, fontWeight: fw.semibold, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.08em", mb: 2 }}>
        {title}
      </Typography>
      {editors.length === 0 ? (
        <Typography sx={textSecondary}>에디터가 없어요.</Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {editors.map((editor, i) => (
            <Box key={editor.username}>
              {i > 0 && <Divider sx={{ my: 2 }} />}
              <EditorItem {...editor} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
