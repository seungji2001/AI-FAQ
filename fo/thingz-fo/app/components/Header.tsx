"use client";

import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutIcon from "@mui/icons-material/Logout";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import { styled } from "@mui/material/styles";
import MobileSidebar from "./MobileSidebar";
import LoginDialog from "./LoginDialog";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants/nav";
import { IVORY, INK } from "@/lib/constants/theme";
import { fs, fw, dim } from "@/lib/styles/typography";
import { toolbarInner } from "@/lib/styles/sx";
import { tokenStorage, getUserFromToken } from "@/lib/auth/token";
import { logout } from "@/lib/api/auth";
import { useT } from "@/lib/i18n/context";

const NavLink = styled(Typography)(() => ({
  fontSize: fs.md,
  fontWeight: fw.medium,
  color: INK,
  cursor: "pointer",
  letterSpacing: "0.01em",
  whiteSpace: "nowrap",
  "&:hover": { opacity: 0.5 },
  transition: "opacity 0.15s",
}));

const WRITE_HREF = "/write";

export default function Header() {
  const t = useT();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      const user = getUserFromToken(token);
      window.setTimeout(() => setUsername(user?.username ?? null), 0);
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    setUsername(null);
    setMenuAnchor(null);
    router.push("/");
  };

  const handleWriteClick = (e: React.MouseEvent) => {
    if (!tokenStorage.getAccessToken()) {
      e.preventDefault();
      setLoginOpen(true);
    }
  };

  const navItems = NAV_ITEMS.filter((item) => item.href !== WRITE_HREF);
  const navLabels: Record<string, string> = {
    "피드": t.nav.feed,
    "탐색": t.nav.explore,
    "마이페이지": t.nav.mypage,
  };

  return (
    <>
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />

      <AppBar
        position="sticky"
        elevation={0}
        sx={{ backgroundColor: IVORY, borderBottom: "1px solid rgba(0,0,0,0.08)" }}
      >
        <Toolbar sx={toolbarInner}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Typography
              sx={{
                fontSize: fs["2xl"],
                color: INK,
                flexShrink: 0,
                fontFamily: "var(--font-pacifico)",
                letterSpacing: "0.02em",
                "&:hover": { opacity: 0.7 },
                transition: "opacity 0.15s",
              }}
            >
              Thingz
            </Typography>
          </Link>

          <Box sx={{ flex: 1 }} />

          <IconButton onClick={() => setSidebarOpen(true)} sx={{ flexShrink: 0, display: { xs: "flex", sm: "none" } }}>
            <MenuIcon sx={{ color: INK }} />
          </IconButton>

          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: { sm: 2.5, md: 3.5 }, alignItems: "center", flexShrink: 0 }}>
              {navItems.map((item) => (
                <Link key={item.label} href={item.href} style={{ textDecoration: "none" }}>
                  <NavLink>{navLabels[item.label] ?? item.label}</NavLink>
                </Link>
              ))}

              <Link href={WRITE_HREF} style={{ textDecoration: "none" }} onClick={handleWriteClick}>
                <Button
                  disableElevation
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ fontSize: fs.sm, fontWeight: fw.semibold, px: 2.5, py: 1, letterSpacing: "0.02em" }}
                >
                  {t.nav.write}
                </Button>
              </Link>

              <LanguageSwitcher />

              {username ? (
                <>
                  <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} sx={{ p: 0 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        fontSize: fs.sm,
                        fontWeight: fw.bold,
                      }}
                    >
                      {username[0].toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={() => setMenuAnchor(null)}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    slotProps={{
                      paper: {
                        sx: {
                          mt: 1,
                          minWidth: 220,
                          borderRadius: dim.radiusCard,
                          border: "1px solid",
                          borderColor: "divider",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                          overflow: "hidden",
                        },
                      },
                    }}
                  >
                    {/* 유저 정보 섹션 */}
                    <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main", color: "primary.contrastText", fontSize: fs.sm, fontWeight: fw.bold }}>
                        {username[0].toUpperCase()}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: fs.md, fontWeight: fw.semibold, color: "text.primary", lineHeight: 1.3 }}>
                          {username}
                        </Typography>
                        <Typography sx={{ fontSize: fs.sm, color: "text.secondary", lineHeight: 1.3 }}>
                          @{username}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider />

                    <Link href="/mypage" style={{ textDecoration: "none", color: "inherit" }} onClick={() => setMenuAnchor(null)}>
                      <MenuItem sx={{ py: 1.25, gap: 1.5, fontSize: fs.md, color: "text.primary", "&:hover": { bgcolor: "rgba(0,0,0,0.03)" } }}>
                        <ListItemIcon sx={{ minWidth: "auto", color: "text.secondary" }}>
                          <Person2OutlinedIcon sx={{ fontSize: 18 }} />
                        </ListItemIcon>
                        {t.nav.mypage}
                      </MenuItem>
                    </Link>

                    <Divider />

                    <MenuItem
                      onClick={handleLogout}
                      sx={{ py: 1.25, gap: 1.5, fontSize: fs.md, color: "text.secondary", "&:hover": { bgcolor: "rgba(0,0,0,0.03)", color: "text.primary" } }}
                    >
                      <ListItemIcon sx={{ minWidth: "auto", color: "inherit" }}>
                        <LogoutIcon sx={{ fontSize: 18 }} />
                      </ListItemIcon>
                      {t.nav.logout}
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  onClick={() => setLoginOpen(true)}
                  variant="outlined"
                  color="primary"
                  size="small"
                  sx={{
                    fontSize: fs.sm,
                    fontWeight: fw.medium,
                    px: 2,
                    py: 0.875,
                    transition: "all 0.2s",
                  }}
                >
                  {t.nav.login}
                </Button>
              )}
          </Box>
        </Toolbar>
      </AppBar>

      <MobileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLoginRequest={() => setLoginOpen(true)}
      />
    </>
  );
}
