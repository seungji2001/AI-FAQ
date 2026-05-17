"use client";

import { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants/nav";
import { KAKAO_COLOR, KAKAO_COLOR_HOVER, KAKAO_TEXT_COLOR, IVORY, INK } from "@/lib/constants/theme";
import { fs, fw, dim } from "@/lib/styles/typography";
import { squareBtn } from "@/lib/styles/sx";
import { tokenStorage, getUserFromToken } from "@/lib/auth/token";
import { logout } from "@/lib/api/auth";
import { useT } from "@/lib/i18n/context";
import LanguageSwitcher from "./LanguageSwitcher";

const WRITE_HREF = "/write";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  onLoginRequest: () => void;
}

export default function MobileSidebar({ open, onClose, onLoginRequest }: MobileSidebarProps) {
  const t = useT();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (token) setUsername(getUserFromToken(token)?.username ?? null);
  }, [open]);

  const handleLogout = async () => {
    await logout();
    setUsername(null);
    onClose();
  };

  const handleWriteClick = (e: React.MouseEvent) => {
    if (!tokenStorage.getAccessToken()) {
      e.preventDefault();
      onClose();
      onLoginRequest();
    } else {
      onClose();
    }
  };

  const navLabels: Record<string, string> = {
    "피드": t.nav.feed,
    "탐색": t.nav.explore,
    "마이페이지": t.nav.mypage,
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { bgcolor: IVORY } } }}
    >
      <Box sx={{ width: dim.drawerWidth, pt: 2, display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, pb: 1.5 }}>
          <Typography sx={{ fontSize: fs["2xl"], fontFamily: "var(--font-pacifico)", color: INK, letterSpacing: "0.02em" }}>
            Thingz
          </Typography>
          <IconButton onClick={onClose} sx={{ color: INK }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: "rgba(0,0,0,0.08)" }} />

        {username ? (
          <Box sx={{ px: 2.5, py: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main", color: "primary.contrastText", fontSize: fs.sm, fontWeight: fw.bold }}>
              {username[0].toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: fs.md, fontWeight: fw.semibold, color: INK }}>@{username}</Typography>
            </Box>
            <Typography
              onClick={handleLogout}
              sx={{ fontSize: fs.sm, color: "text.secondary", cursor: "pointer", "&:hover": { color: INK } }}
            >
              {t.nav.logout}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ px: 2.5, py: 2.5 }}>
            <Button
              fullWidth
              onClick={() => { onClose(); onLoginRequest(); }}
              variant="contained"
              disableElevation
              sx={{
                bgcolor: KAKAO_COLOR,
                color: KAKAO_TEXT_COLOR,
                "&:hover": { bgcolor: KAKAO_COLOR_HOVER },
                fontWeight: fw.bold,
                fontSize: fs.sm,
                ...squareBtn,
                py: 1.25,
                gap: 1,
              }}
            >
              <Box
                component="img"
                src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png"
                alt="kakao"
                sx={{ width: 18, height: 18 }}
              />
              {t.login.startWithKakao}
            </Button>
          </Box>
        )}

        <Divider sx={{ borderColor: "rgba(0,0,0,0.08)" }} />

        <List sx={{ pt: 1 }}>
          {NAV_ITEMS.filter((item) => item.href !== WRITE_HREF).map((item) => (
            <ListItem key={item.label} disablePadding>
              <Link href={item.href} style={{ textDecoration: "none", width: "100%" }}>
                <ListItemButton onClick={onClose} sx={{ px: 2.5, py: 1.25 }}>
                  <ListItemText
                    primary={navLabels[item.label] ?? item.label}
                    slotProps={{ primary: { sx: { fontSize: fs.lg, color: INK, fontWeight: fw.medium } } }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>

        <Box sx={{ px: 2.5, pb: 2 }}>
          <LanguageSwitcher />
        </Box>

        <Box sx={{ mt: "auto", px: 2.5, pb: 4 }}>
          <Link href={WRITE_HREF} style={{ textDecoration: "none" }} onClick={handleWriteClick}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              disableElevation
              sx={{ fontWeight: fw.semibold, fontSize: fs.md, py: 1.5, letterSpacing: "0.02em" }}
            >
              {t.nav.write}
            </Button>
          </Link>
        </Box>
      </Box>
    </Drawer>
  );
}
