"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { fs, fw, dim, btnPill } from "@/lib/styles/typography";
import { useT } from "@/lib/i18n/context";

interface WriteHeaderProps {
  onSaveDraft?: () => void;
  onPublish?: () => void;
  loading?: boolean;
}

export default function WriteHeader({ onSaveDraft, onPublish, loading = false }: WriteHeaderProps) {
  const t = useT();
  return (
    <AppBar position="sticky" elevation={0}
      sx={{ backgroundColor: "white", borderBottom: "1px solid", borderColor: "grey.300" }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3, md: 6 }, minHeight: dim.appBarHeight }}>
        <Typography sx={{ fontSize: fs["3xl"], fontWeight: fw.bold, color: "text.primary", flex: 1 }}>THINGZ</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Typography onClick={loading ? undefined : onSaveDraft}
            sx={{ fontSize: fs.md, color: loading ? "text.disabled" : "text.secondary", cursor: loading ? "default" : "pointer", "&:hover": { color: loading ? "text.disabled" : "text.primary" } }}
          >
            {t.write.saveDraft}
          </Typography>
          <Button onClick={onPublish} disabled={loading} disableElevation variant="contained" sx={btnPill}>
            {loading ? t.write.processing : t.write.publish}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
