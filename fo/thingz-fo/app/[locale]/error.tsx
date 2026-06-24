"use client";

import { useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useT } from "@/lib/i18n/context";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useT();

  useEffect(() => {
    console.error("Unhandled page error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", px: 2 }}>
      <Box sx={{ maxWidth: 460, textAlign: "center" }}>
        <Typography component="h1" sx={{ fontSize: 28, fontWeight: 700, mb: 1 }}>
          {t.error.title}
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 3 }}>
          {t.error.description}
        </Typography>
        <Button variant="contained" onClick={reset}>
          {t.error.retry}
        </Button>
      </Box>
    </Box>
  );
}
