"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import EditorItem from "./EditorItem";

const EDITORS = [
  { username: "@minimal_jungsoo", followers: "1.2k", articles: 34 },
  { username: "@vintage_haein", followers: "980", articles: 21 },
  { username: "@daily_objet", followers: "3.4k", articles: 58 },
];

export default function TodayEditors() {
  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: 3,
        boxShadow: 1,
        p: 2.5,
      }}
    >
      <Typography sx={{ fontSize: "15px", fontWeight: 700, color: "text.primary", mb: 1.5 }}>
        오늘의 에디터
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {EDITORS.map((editor) => (
          <EditorItem key={editor.username} {...editor} />
        ))}
      </Box>
    </Box>
  );
}
