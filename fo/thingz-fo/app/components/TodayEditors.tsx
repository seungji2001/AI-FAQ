
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import EditorItem from "./EditorItem";
import { UserItem } from "@/lib/types/user";
import { panelBase } from "@/lib/styles/sx";
import { titleSm } from "@/lib/styles/typography";

const FALLBACK_EDITORS = [
  { username: "@minimal_jungsoo", followers: "1.2k", articles: 34 },
  { username: "@vintage_haein", followers: "980", articles: 21 },
  { username: "@daily_objet", followers: "3.4k", articles: 58 },
];

interface TodayEditorsProps {
  users?: UserItem[];
}

export default function TodayEditors({ users }: TodayEditorsProps) {
  const editors = users && users.length > 0
    ? users.slice(0, 5).map((u) => ({
        username: `@${u.username}`,
        followers: String(u.articleCount),
        articles: u.articleCount,
        avatarSrc: u.avatarUrl ?? undefined,
      }))
    : FALLBACK_EDITORS;

  return (
    <Box sx={{ ...panelBase, p: 2.5 }}>
      <Typography sx={{ ...titleSm, mb: 1.5 }}>오늘의 에디터</Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {editors.map((editor) => (
          <EditorItem key={editor.username} {...editor} />
        ))}
      </Box>
    </Box>
  );
}
