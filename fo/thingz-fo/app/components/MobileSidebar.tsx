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
import { KAKAO_COLOR, KAKAO_COLOR_HOVER, KAKAO_TEXT_COLOR } from "@/lib/constants/theme";
import { fs, fw, dim } from "@/lib/styles/typography";
import { tokenStorage, getUserFromToken } from "@/lib/auth/token";
import { logout, getKakaoLoginUrl } from "@/lib/api/auth";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
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

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: dim.drawerWidth, pt: 2, display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, pb: 1 }}>
          <Typography sx={{ fontWeight: fw.bold, fontSize: fs["2xl"] }}>THINGZ</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />

        {username ? (
          <Box sx={{ px: 2, py: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: KAKAO_COLOR, fontSize: fs.sm, color: KAKAO_TEXT_COLOR }}>
              {username[0].toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: fs.md, fontWeight: fw.bold }}>@{username}</Typography>
            </Box>
            <Typography
              onClick={handleLogout}
              sx={{ fontSize: fs.sm, color: "text.secondary", cursor: "pointer" }}
            >
              로그아웃
            </Typography>
          </Box>
        ) : (
          <Box sx={{ px: 2, py: 2 }}>
            <Button
              fullWidth href={getKakaoLoginUrl()}
              variant="contained" disableElevation
              sx={{ bgcolor: KAKAO_COLOR, color: KAKAO_TEXT_COLOR, "&:hover": { bgcolor: KAKAO_COLOR_HOVER }, fontWeight: fw.bold, fontSize: fs.sm, borderRadius: 2 }}
            >
              카카오로 시작하기
            </Button>
          </Box>
        )}

        <Divider />
        <List>
          {NAV_ITEMS.map((item) => (
            <ListItem key={item.label} disablePadding>
              <Link href={item.href} style={{ textDecoration: "none", width: "100%" }}>
                <ListItemButton onClick={onClose}>
                  <ListItemText
                    primary={item.label}
                    slotProps={{ primary: { sx: { fontSize: fs.lg, color: "text.primary" } } }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
