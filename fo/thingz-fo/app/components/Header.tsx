"use client";

import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MobileSidebar from "./MobileSidebar";
import Link from "next/link";

const NAV_ROUTES: Record<string, string> = {
  피드: "/",
  탐색: "/explore",
  발행: "/write",
  마이페이지: "/mypage",
};

const SearchBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  borderRadius: "16px",
  padding: "4px 16px",
  display: "flex",
  alignItems: "center",
  width: "480px",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const NavItem = styled(Typography, { shouldForwardProp: (prop) => prop !== "active" })<{ active?: boolean }>(({ theme, active }) => ({
  fontSize: "14px",
  fontWeight: active ? 700 : 400,
  color: active ? "#FBA96E" : theme.palette.text.primary,
  cursor: "pointer",
  whiteSpace: "nowrap",
  "&:hover": {
    opacity: 0.7,
  },
}));

const NAV_ITEMS = [
  { label: "피드", active: true },
  { label: "탐색", active: false },
  { label: "발행", active: false },
  { label: "마이페이지", active: false },
];

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "white",
          borderBottom: "1px solid",
          borderColor: "grey.300",
        }}
      >
        <Toolbar
          sx={{
            maxWidth: "1440px",
            width: "100%",
            mx: "auto",
            px: { xs: 2, sm: 3, md: 6 },
            gap: 2,
            minHeight: "64px !important",
          }}
        >
          {/* 로고 */}
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 700,
              color: "text.primary",
              flexShrink: 0,
            }}
          >
            THINGZ
          </Typography>

          {/* 검색창 */}
          <SearchBox sx={{ mx: "auto" }}>
            <InputBase
              placeholder="물건 이야기 검색"
              fullWidth
              inputProps={{ "aria-label": "search" }}
              sx={{ fontSize: "12px", color: "text.secondary" }}
            />
          </SearchBox>

          {/* PC: 네비게이션 / 모바일: 햄버거 버튼 */}
          {isMobile ? (
            <IconButton onClick={() => setSidebarOpen(true)} sx={{ flexShrink: 0 }}>
              <MenuIcon sx={{ color: "text.primary" }} />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", gap: { sm: 2, md: 4 }, alignItems: "center" }}>
              {NAV_ITEMS.map((item) => (
                <Link key={item.label} href={NAV_ROUTES[item.label]} style={{ textDecoration: "none" }}>
                  <NavItem active={item.active}>{item.label}</NavItem>
                </Link>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
