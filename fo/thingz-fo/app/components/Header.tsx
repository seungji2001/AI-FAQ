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
import { NAV_ITEMS } from "@/lib/constants/nav";
import { BRAND_COLOR } from "@/lib/constants/theme";
import { fs, fw, dim } from "@/lib/styles/typography";
import { toolbarInner } from "@/lib/styles/sx";

const SearchBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  borderRadius: dim.searchBorderRadius,
  padding: "4px 16px",
  display: "flex",
  alignItems: "center",
  width: dim.searchWidth,
  [theme.breakpoints.down("sm")]: { width: "100%" },
}));

const NavItem = styled(Typography, { shouldForwardProp: (prop) => prop !== "active" })<{ active?: boolean }>(
  ({ theme, active }) => ({
    fontSize: fs.md,
    fontWeight: active ? fw.bold : fw.normal,
    color: active ? BRAND_COLOR : theme.palette.text.primary,
    cursor: "pointer",
    whiteSpace: "nowrap",
    "&:hover": { opacity: 0.7 },
  })
);

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <AppBar position="sticky" elevation={0}
        sx={{ backgroundColor: "white", borderBottom: "1px solid", borderColor: "grey.300" }}
      >
        <Toolbar sx={toolbarInner}>
          <Typography sx={{ fontSize: fs["3xl"], fontWeight: fw.bold, color: "text.primary", flexShrink: 0 }}>
            THINGZ
          </Typography>

          <SearchBox sx={{ mx: "auto" }}>
            <InputBase
              placeholder="물건 이야기 검색"
              fullWidth
              inputProps={{ "aria-label": "search" }}
              sx={{ fontSize: fs.sm, color: "text.secondary" }}
            />
          </SearchBox>

          {isMobile ? (
            <IconButton onClick={() => setSidebarOpen(true)} sx={{ flexShrink: 0 }}>
              <MenuIcon sx={{ color: "text.primary" }} />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", gap: { sm: 2, md: 4 }, alignItems: "center" }}>
              {NAV_ITEMS.map((item) => (
                <Link key={item.label} href={item.href} style={{ textDecoration: "none" }}>
                  <NavItem>{item.label}</NavItem>
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
