import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import EditorItem from "./EditorItem";
import { UserItem } from "@/lib/types/user";
import { fs, fw, textSecondary } from "@/lib/styles/typography";

const FALLBACK_EDITORS = [
  { username: "@minimal_jungsoo", followers: "1.2k", articles: 34 },
  { username: "@vintage_haein", followers: "980", articles: 21 },
  { username: "@daily_objet", followers: "3.4k", articles: 58 },
];

interface TodayEditorsProps {
  users?: UserItem[];
  title?: string;
}

export default function TodayEditors({ users, title = "오늘의 에디터" }: TodayEditorsProps) {
  const editors = users && users.length > 0
    ? users.slice(0, 5).map((u) => ({
        username: `@${u.username}`,
        followers: String(u.articleCount),
        articles: u.articleCount,
        avatarSrc: u.avatarUrl ?? undefined,
      }))
    : FALLBACK_EDITORS;

  return (
    <Box>
      <Typography sx={{ fontSize: fs.sm, fontWeight: fw.semibold, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.08em", mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {editors.map((editor, i) => (
          <Box key={editor.username}>
            {i > 0 && <Divider sx={{ my: 2 }} />}
            <EditorItem {...editor} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
