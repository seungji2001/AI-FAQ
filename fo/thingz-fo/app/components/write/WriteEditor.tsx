"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

const DEFAULT_TAGS = ["#빈티지", "#카메라", "#아날로그"];

export default function WriteEditor() {
  const [tags, setTags] = useState<string[]>(DEFAULT_TAGS);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      const tag = tagInput.startsWith("#") ? tagInput.trim() : `#${tagInput.trim()}`;
      if (!tags.includes(tag)) setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const handleDeleteTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <Box sx={{ bgcolor: "white", borderRadius: 3, overflow: "hidden", boxShadow: 1 }}>
      {/* 이미지 업로드 */}
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
        <Typography sx={{ fontSize: "32px" }}>🖼</Typography>
        <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
          사진을 드래그하거나 클릭해서 업로드
        </Typography>
        <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
          (최대 10장 · 첫 번째 사진이 커버)
        </Typography>
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 }, pt: 2, pb: 3, display: "flex", flexDirection: "column", gap: 0 }}>
        {/* 제목 */}
        <Divider />
        <InputBase
          placeholder="이 물건과의 이야기를 제목으로..."
          fullWidth
          sx={{ fontSize: { xs: "18px", md: "20px" }, fontWeight: 700, py: 1.5, color: "text.primary" }}
          inputProps={{ "aria-label": "title" }}
        />
        <Divider />

        {/* 본문 */}
        <InputBase
          placeholder={"어떤 물건인가요? 어디서 만났나요? 어떻게 함께했나요?\n\n이야기를 자유롭게 써주세요. 최소 200자를 권장해요."}
          fullWidth
          multiline
          minRows={8}
          sx={{ fontSize: "14px", color: "text.primary", py: 2 }}
          inputProps={{ "aria-label": "body" }}
        />
        <Divider />

        {/* 태그 */}
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1, pt: 2 }}>
          <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>태그 추가</Typography>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              onDelete={() => handleDeleteTag(tag)}
              sx={{ bgcolor: "grey.200", fontSize: "12px", borderRadius: "12px" }}
            />
          ))}
          <InputBase
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="+ 태그"
            sx={{ fontSize: "12px", color: "text.primary", minWidth: 60 }}
          />
        </Box>
      </Box>
    </Box>
  );
}
