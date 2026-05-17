"use client";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { fs, fw, dim } from "@/lib/styles/typography";
import { useT } from "@/lib/i18n/context";

interface WriteHeaderProps {
  onSaveDraft?: () => void;
  onPublish?: () => void;
  loading?: boolean;
}

export default function WriteHeader({ onSaveDraft, onPublish, loading = false }: WriteHeaderProps) {
  const t = useT();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 2.5,
        mb: 3,
        pb: 2.5,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        onClick={loading ? undefined : onSaveDraft}
        sx={{
          fontSize: fs.md,
          color: loading ? "text.disabled" : "text.secondary",
          cursor: loading ? "default" : "pointer",
          "&:hover": { color: loading ? "text.disabled" : "text.primary" },
          transition: "color 0.15s",
        }}
      >
        {t.write.saveDraft}
      </Typography>
      <Button
        onClick={onPublish}
        disabled={loading}
        disableElevation
        variant="contained"
        color="primary"
        sx={{
          "&:disabled": { bgcolor: "grey.300", color: "grey.500" },
          fontSize: fs.sm,
          fontWeight: fw.semibold,
          px: 2.5,
          py: 1,
          letterSpacing: "0.02em",
        }}
      >
        {loading ? t.write.processing : t.write.publish}
      </Button>
    </Box>
  );
}
