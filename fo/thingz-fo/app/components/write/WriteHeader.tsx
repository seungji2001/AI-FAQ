"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

interface WriteHeaderProps {
  onSaveDraft?: () => void;
  onPublish?: () => void;
}

export default function WriteHeader({ onSaveDraft, onPublish }: WriteHeaderProps) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ backgroundColor: "white", borderBottom: "1px solid", borderColor: "grey.300" }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3, md: 6 }, minHeight: "64px !important" }}>
        <Typography sx={{ fontSize: "20px", fontWeight: 700, color: "text.primary", flex: 1 }}>
          THINGZ
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Typography
            onClick={onSaveDraft}
            sx={{ fontSize: "14px", color: "text.secondary", cursor: "pointer", "&:hover": { color: "text.primary" } }}
          >
            임시저장
          </Typography>
          <Button
            onClick={onPublish}
            disableElevation
            variant="contained"
            sx={{ bgcolor: "grey.900", color: "white", borderRadius: "20px", fontSize: "12px", fontWeight: 700, px: 3, "&:hover": { bgcolor: "grey.800" } }}
          >
            발행하기
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
