"use client";

import { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { mainContent } from "@/lib/styles/sx";
import { textSecondary, titleMd } from "@/lib/styles/typography";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Box sx={{ ...mainContent, textAlign: "center", py: 8 }}>
      <Typography sx={titleMd}>오류가 발생했습니다</Typography>
      <Typography sx={{ ...textSecondary, mt: 1, mb: 3 }}>잠시 후 다시 시도해주세요.</Typography>
      <Button variant="outlined" onClick={reset} sx={{ mr: 1 }}>다시 시도</Button>
      <Button variant="outlined" href="/">홈으로</Button>
    </Box>
  );
}
