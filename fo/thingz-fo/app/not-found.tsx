import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { fs, titleLg, textSecondary } from "@/lib/styles/typography";

export default function NotFound() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 2, textAlign: "center", px: 2 }}>
      <Typography sx={{ fontSize: fs.display, fontWeight: 700, color: "grey.200", lineHeight: 1 }}>
        404
      </Typography>
      <Typography sx={titleLg}>페이지를 찾을 수 없어요</Typography>
      <Typography sx={textSecondary}>
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </Typography>
      <Button href="/" variant="outlined" sx={{ mt: 1, borderRadius: 2 }}>
        홈으로 돌아가기
      </Button>
    </Box>
  );
}
