"use client";

import { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { mainContent } from "@/lib/styles/sx";
import { titleMd, textSecondary } from "@/lib/styles/typography";
import { useT } from "@/lib/i18n/context";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useT();
  useEffect(() => { console.error(error); }, [error]);

  return (
    <Box sx={{ ...mainContent, textAlign: "center", py: 8 }}>
      <Typography sx={titleMd}>{t.error.title}</Typography>
      <Typography sx={{ ...textSecondary, mt: 1, mb: 3 }}>{t.error.description}</Typography>
      <Button variant="outlined" onClick={reset} sx={{ mr: 1 }}>{t.error.retry}</Button>
      <Button variant="outlined" href="/">{t.error.home}</Button>
    </Box>
  );
}
