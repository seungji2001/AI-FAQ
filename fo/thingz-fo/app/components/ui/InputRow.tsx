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
}

export default function InputRow({ value, onChange, placeholder, suffix }: InputRowProps) {
  return (
    <Box sx={{ bgcolor: "grey.200", borderRadius: 2, px: 2, height: dim.inputRowHeight, display: "flex", alignItems: "center" }}>
      <InputBase
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        fullWidth
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
