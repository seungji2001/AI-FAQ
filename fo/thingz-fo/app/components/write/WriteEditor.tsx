"use client";

import { useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { panelBase } from "@/lib/styles/sx";
import { fs, fw, dim } from "@/lib/styles/typography";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

interface WriteEditorProps {
  title: string;
  content: string;
  tags: string[];
  tagInput: string;
  imageUrls: string[];
  uploadingCount: number;
  onTitleChange: (v: string) => void;
  onContentChange: (v: string) => void;
  onTagInputChange: (v: string) => void;
  onTagAdd: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onTagDelete: (tag: string) => void;
  onFilesSelected: (files: File[]) => void;
  onImageRemove: (index: number) => void;
}

export default function WriteEditor({
  title, content, tags, tagInput, imageUrls, uploadingCount,
  onTitleChange, onContentChange, onTagInputChange, onTagAdd, onTagDelete,
  onFilesSelected, onImageRemove,
}: WriteEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter((f) => ACCEPTED_TYPES.includes(f.type));
    if (files.length > 0) onFilesSelected(files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) => ACCEPTED_TYPES.includes(f.type));
    if (files.length > 0) onFilesSelected(files);
  };

  const hasImages = imageUrls.length > 0 || uploadingCount > 0;

  return (
    <Box sx={{ ...panelBase, overflow: "hidden" }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {!hasImages ? (
        <Box
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
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
      ) : (
        <Box
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          sx={{ p: 2, display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center", minHeight: 120, bgcolor: "grey.50" }}
        >
          {imageUrls.map((url, i) => (
            <Box key={url} sx={{ position: "relative", width: 100, height: 100, borderRadius: 1, overflow: "hidden", flexShrink: 0 }}>
              <Box
                component="img"
                src={url}
                alt={`이미지 ${i + 1}`}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {i === 0 && (
                <Box sx={{ position: "absolute", bottom: 4, left: 4, bgcolor: "rgba(0,0,0,0.6)", color: "white", fontSize: "10px", px: 0.5, borderRadius: 0.5 }}>
                  커버
                </Box>
              )}
              <IconButton
                size="small"
                onClick={() => onImageRemove(i)}
                sx={{ position: "absolute", top: 2, right: 2, bgcolor: "rgba(0,0,0,0.5)", color: "white", p: 0.3, "&:hover": { bgcolor: "rgba(0,0,0,0.75)" } }}
              >
                <CloseIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          ))}
          {Array.from({ length: uploadingCount }).map((_, i) => (
            <Box key={`uploading-${i}`} sx={{ width: 100, height: 100, borderRadius: 1, bgcolor: "grey.200", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <CircularProgress size={24} />
            </Box>
          ))}
          {imageUrls.length < 10 && (
            <Box
              onClick={() => fileInputRef.current?.click()}
              sx={{ width: 100, height: 100, borderRadius: 1, border: "2px dashed", borderColor: "grey.400", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, "&:hover": { borderColor: "grey.600" } }}
            >
              <Typography sx={{ fontSize: fs["3xl"], color: "grey.400" }}>+</Typography>
            </Box>
          )}
        </Box>
      )}

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
