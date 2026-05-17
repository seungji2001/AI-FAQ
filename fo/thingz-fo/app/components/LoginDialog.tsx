"use client";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import { fs, fw } from "@/lib/styles/typography";
import { squareBtn } from "@/lib/styles/sx";
import { KAKAO_COLOR, KAKAO_COLOR_HOVER, KAKAO_TEXT_COLOR, IVORY, INK } from "@/lib/constants/theme";
import { getKakaoLoginUrl } from "@/lib/api/auth";
import { useT } from "@/lib/i18n/context";

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginDialog({ open, onClose }: LoginDialogProps) {
  const t = useT();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            ...squareBtn,
            width: 400,
            bgcolor: IVORY,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1.5, px: 1.5 }}>
        <IconButton size="small" onClick={onClose} sx={{ color: "text.secondary" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 5, pb: 5, pt: 1 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            sx={{
              fontSize: fs["4xl"],
              fontFamily: "var(--font-pacifico)",
              letterSpacing: "0.02em",
              color: INK,
              mb: 1,
            }}
          >
            Thingz
          </Typography>
          <Typography sx={{ fontSize: fs.md, color: "text.secondary", lineHeight: 1.6 }}>
            {t.login.description}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4, borderColor: "rgba(0,0,0,0.1)" }} />

        <Button
          fullWidth
          onClick={() => { window.location.href = getKakaoLoginUrl(); }}
          variant="contained"
          disableElevation
          sx={{
            bgcolor: KAKAO_COLOR,
            color: KAKAO_TEXT_COLOR,
            "&:hover": { bgcolor: KAKAO_COLOR_HOVER },
            fontWeight: fw.bold,
            fontSize: fs.md,
            ...squareBtn,
            py: 1.75,
            gap: 1.5,
            boxShadow: "none",
            letterSpacing: "0.01em",
          }}
        >
          <Box
            component="img"
            src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png"
            alt="kakao"
            sx={{ width: 20, height: 20 }}
          />
          {t.login.startWithKakao}
        </Button>

        <Typography
          sx={{
            fontSize: fs.xs,
            color: "text.disabled",
            textAlign: "center",
            mt: 2.5,
            lineHeight: 1.6,
          }}
        >
          {t.login.terms ?? "로그인 시 서비스 이용약관에 동의하게 됩니다."}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
