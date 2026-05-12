"use client";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { fs, fw } from "@/lib/styles/typography";
import { KAKAO_COLOR, KAKAO_COLOR_HOVER } from "@/lib/constants/theme";
import { getKakaoLoginUrl } from "@/lib/api/auth";

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginDialog({ open, onClose }: LoginDialogProps) {
  const handleKakaoLogin = () => {
    window.location.href = getKakaoLoginUrl();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            width: 360,
            p: 1,
          },
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1, px: 1 }}>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 4, pb: 4, pt: 1, textAlign: "center" }}>
        <Typography sx={{ fontSize: fs["3xl"], fontWeight: fw.bold, mb: 1 }}>
          THINGZ
        </Typography>
        <Typography sx={{ fontSize: fs.md, color: "text.secondary", mb: 3 }}>
          카카오로 로그인하고 나만의 물건 이야기를 등록해보세요
        </Typography>

        <Button
          fullWidth
          onClick={handleKakaoLogin}
          sx={{
            bgcolor: KAKAO_COLOR,
            color: "#000",
            "&:hover": { bgcolor: KAKAO_COLOR_HOVER },
            fontWeight: fw.bold,
            fontSize: fs.md,
            borderRadius: 2,
            py: 1.5,
            gap: 1,
            boxShadow: "none",
            "&:active": { boxShadow: "none" },
          }}
          variant="contained"
          disableElevation
        >
          <Box
            component="img"
            src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png"
            alt="kakao"
            sx={{ width: 20, height: 20 }}
          />
          카카오로 시작하기
        </Button>
      </DialogContent>
    </Dialog>
  );
}
