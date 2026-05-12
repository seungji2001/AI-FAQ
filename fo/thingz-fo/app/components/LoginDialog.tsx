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
import { useT } from "@/lib/i18n/context";

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginDialog({ open, onClose }: LoginDialogProps) {
  const t = useT();

  return (
    <Dialog open={open} onClose={onClose}
      slotProps={{ paper: { sx: { borderRadius: 3, width: 360, p: 1 } } }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1, px: 1 }}>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <DialogContent sx={{ px: 4, pb: 4, pt: 1, textAlign: "center" }}>
        <Typography sx={{ fontSize: fs["3xl"], fontWeight: fw.bold, mb: 1 }}>THINGZ</Typography>
        <Typography sx={{ fontSize: fs.md, color: "text.secondary", mb: 3 }}>{t.login.description}</Typography>
        <Button fullWidth onClick={() => { window.location.href = getKakaoLoginUrl(); }}
          sx={{ bgcolor: KAKAO_COLOR, color: "#000", "&:hover": { bgcolor: KAKAO_COLOR_HOVER }, fontWeight: fw.bold, fontSize: fs.md, borderRadius: 2, py: 1.5, gap: 1, boxShadow: "none", "&:active": { boxShadow: "none" } }}
          variant="contained" disableElevation
        >
          <Box component="img"
            src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png"
            alt="kakao" sx={{ width: 20, height: 20 }}
          />
          {t.login.startWithKakao}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
