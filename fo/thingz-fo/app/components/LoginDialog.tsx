"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CloseIcon from "@mui/icons-material/Close";
import { fs, fw } from "@/lib/styles/typography";
import { squareBtn } from "@/lib/styles/sx";
import { KAKAO_COLOR, KAKAO_COLOR_HOVER, KAKAO_TEXT_COLOR, IVORY, INK } from "@/lib/constants/theme";
import { getKakaoLoginUrl, loginWithEmail, signup } from "@/lib/api/auth";
import { tokenStorage } from "@/lib/auth/token";
import { useLocale, useT } from "@/lib/i18n/context";
import { useToast } from "@/app/components/ui/Toast";

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Mode = "login" | "signup";

export default function LoginDialog({ open, onClose, onSuccess }: LoginDialogProps) {
  const t = useT();
  const { locale } = useLocale();
  const toast = useToast();
  const router = useRouter();

  const [tab, setTab] = useState<0 | 1>(0); // 0: 소셜, 1: 이메일
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail(""); setPassword(""); setUsername("");
  };

  const handleClose = () => {
    resetForm();
    setTab(0);
    setMode("login");
    onClose();
  };

  const handleTabChange = (_: React.SyntheticEvent, newVal: 0 | 1) => {
    setTab(newVal);
    resetForm();
    setMode("login");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { toast.warn(t.login.emailRequired); return; }
    if (!password.trim()) { toast.warn(t.login.passwordRequired); return; }
    if (mode === "signup") {
      if (!username.trim()) { toast.warn(t.login.usernameRequired); return; }
      if (password.length < 8) { toast.warn(t.login.passwordMinLength); return; }
      if (username.length < 2) { toast.warn(t.login.usernameMinLength); return; }
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        await signup(email, password, username);
        toast.success(t.login.signupSuccess);
        setMode("login");
        setPassword("");
        setUsername("");
      } else {
        const tokens = await loginWithEmail(email, password);
        tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
        handleClose();
        router.refresh();
        onSuccess?.();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : (mode === "signup" ? t.login.signupFailed : t.login.loginFailed);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoLogin = () => {
    document.cookie = `auth_return_locale=${locale}; path=/; max-age=600; SameSite=Lax`;
    window.location.href = getKakaoLoginUrl();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: { ...squareBtn, width: 400, bgcolor: IVORY, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" },
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1.5, px: 1.5 }}>
        <IconButton size="small" onClick={handleClose} sx={{ color: "text.secondary" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 5, pb: 5, pt: 0 }}>
        {/* 로고 */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography sx={{ fontSize: fs["4xl"], fontFamily: "var(--font-pacifico)", letterSpacing: "0.02em", color: INK, mb: 1 }}>
            Thingz
          </Typography>
          <Typography sx={{ fontSize: fs.md, color: "text.secondary", lineHeight: 1.6 }}>
            {t.login.description}
          </Typography>
        </Box>

        {/* 탭 */}
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 3, "& .MuiTab-root": { fontSize: fs.sm, fontWeight: fw.medium } }}
        >
          <Tab label={t.login.socialLoginTab} />
          <Tab label={t.login.emailTab} />
        </Tabs>

        {/* 소셜 탭 */}
        {tab === 0 && (
          <>
            <Button
              fullWidth
              onClick={handleKakaoLogin}
              variant="contained"
              disableElevation
              sx={{
                bgcolor: KAKAO_COLOR, color: KAKAO_TEXT_COLOR,
                "&:hover": { bgcolor: KAKAO_COLOR_HOVER },
                fontWeight: fw.bold, fontSize: fs.md,
                ...squareBtn, py: 1.75, gap: 1.5, boxShadow: "none",
              }}
            >
              <Box component="img"
                src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png"
                alt="kakao" sx={{ width: 20, height: 20 }}
              />
              {t.login.startWithKakao}
            </Button>

            <Typography sx={{ fontSize: fs.xs, color: "text.disabled", textAlign: "center", mt: 2.5, lineHeight: 1.6 }}>
              {t.login.terms}
            </Typography>
          </>
        )}

        {/* 이메일 탭 */}
        {tab === 1 && (
          <Box component="form" onSubmit={handleEmailSubmit} sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {mode === "signup" && (
              <TextField
                label={t.login.username}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                size="small"
                fullWidth
                autoComplete="username"
                slotProps={{ htmlInput: { maxLength: 30 } }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 0 } }}
              />
            )}
            <TextField
              label={t.login.email}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small"
              fullWidth
              autoComplete="email"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 0 } }}
            />
            <TextField
              label={t.login.password}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="small"
              fullWidth
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 0 } }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableElevation
              disabled={loading}
              sx={{ ...squareBtn, py: 1.5, mt: 0.5, fontWeight: fw.bold, fontSize: fs.md }}
            >
              {loading ? "..." : (mode === "signup" ? t.login.signupBtn : t.login.loginBtn)}
            </Button>

            <Divider sx={{ my: 0.5 }} />

            <Button
              variant="text"
              fullWidth
              size="small"
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); resetForm(); }}
              sx={{ fontSize: fs.sm, color: "text.secondary", textTransform: "none" }}
            >
              {mode === "login" ? t.login.switchToSignup : t.login.switchToLogin}
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
