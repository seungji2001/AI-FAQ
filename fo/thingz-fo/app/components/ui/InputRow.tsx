"use client";

import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import Typography from "@mui/material/Typography";
import { fs, dim } from "@/lib/styles/typography";

interface InputRowProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  suffix?: string;
  multiline?: boolean;
  rows?: number;
}

export default function InputRow({ value, onChange, placeholder, suffix, multiline, rows }: InputRowProps) {
  return (
    <Box sx={{
      bgcolor: "grey.100",
      borderRadius: 2,
      px: 2,
      py: multiline ? 1.5 : 0,
      minHeight: multiline ? undefined : dim.inputRowHeight,
      display: "flex",
      alignItems: multiline ? "flex-start" : "center",
    }}>
      <InputBase
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        fullWidth
        multiline={multiline}
        rows={multiline ? (rows ?? 3) : undefined}
        sx={{ fontSize: fs.sm }}
      />
      {suffix && (
        <Typography sx={{ fontSize: fs.sm, color: "text.secondary", flexShrink: 0, ml: 1 }}>
          {suffix}
        </Typography>
      )}
    </Box>
  );
}
