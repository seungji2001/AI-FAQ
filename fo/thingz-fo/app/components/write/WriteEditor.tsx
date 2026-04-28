"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { panelBase } from "@/lib/styles/sx";
import { fs, fw, dim } from "@/lib/styles/typography";

interface WriteEditorProps {
  title: string;
  content: string;
  tags: string[];
  tagInput: string;
  onTitleChange: (v: string) => void;
  onContentChange: (v: string) => void;
  onTagInputChange: (v: string) => void;
  onTagAdd: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onTagDelete: (tag: string) => void;
}

export default function WriteEditor({
  title, content, tags, tagInput,
  onTitleChange, onContentChange, onTagInputChange, onTagAdd, onTagDelete,
}: WriteEditorProps) {
  return (
    <Box sx={{ ...panelBase, overflow: "hidden" }}>
      <Box
        sx={{
          width: "100%",
          aspectRatio: { xs: "4/3", md: "16/6" },
          bgcolor: "grey.200",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          cursor: "pointer",
          "&:hover": { bgcolor: "grey.300" },
          transition: "background-color 0.2s",
        }}
      >
        <Typography sx={{ fontSize: fs["6xl"] }}>🖼</Typography>
        <Typography sx={{ fontSize: fs.md, color: "text.secondary" }}>
          사진을 드래그하거나 클릭해서 업로드
        </Typography>
        <Typography sx={{ fontSize: fs.sm, color: "text.secondary" }}>
          (최대 10장 · 첫 번째 사진이 커버)
        </Typography>
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 }, pt: 2, pb: 3, display: "flex", flexDirection: "column" }}>
        <Divider />
        <InputBase
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="이 물건과의 이야기를 제목으로..."
          fullWidth
          sx={{ fontSize: { xs: fs["2xl"], md: fs["3xl"] }, fontWeight: fw.bold, py: 1.5 }}
        />
        <Divider />
        <InputBase
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder={"어떤 물건인가요? 어디서 만났나요? 어떻게 함께했나요?\n\n이야기를 자유롭게 써주세요. 최소 200자를 권장해요."}
          fullWidth
          multiline
          minRows={8}
          sx={{ fontSize: fs.md, py: 2 }}
        />
        <Divider />
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1, pt: 2 }}>
          <Typography sx={{ fontSize: fs.sm, color: "text.secondary" }}>태그 추가</Typography>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              onDelete={() => onTagDelete(tag)}
              sx={{ bgcolor: "grey.200", fontSize: fs.sm, borderRadius: dim.radiusTag }}
            />
          ))}
          <InputBase
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            onKeyDown={onTagAdd}
            placeholder="+ 태그"
            sx={{ fontSize: fs.sm, minWidth: 60 }}
          />
        </Box>
      </Box>
    </Box>
  );
}
