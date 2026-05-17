import { SxProps, Theme } from "@mui/material/styles";
import { dim } from "@/lib/styles/typography";

// ─── 카드 (FeaturedCard — hover만 사용, ItemCard는 자체 스타일) ──
export const cardBase: SxProps<Theme> = {
  width: "100%",
  bgcolor: "white",
  cursor: "pointer",
  transition: "opacity 0.15s",
  "&:hover": { opacity: 0.85 },
};

// 이미지 박스 컨테이너 — 고정 크기, 여백 포함
export const cardImage: SxProps<Theme> = {
  width: "100%",
  bgcolor: "grey.100",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

// 이미지 태그 — 박스 안에서 비율 유지, contain
export const imgContain: SxProps<Theme> = {
  width: "100%",
  height: "100%",
  objectFit: "contain" as const,
  display: "block",
};

// ─── 패널 (ArticleTrade, WriteSaleSettings 등 사이드 패널) ───
export const panelBase: SxProps<Theme> = {
  bgcolor: "background.paper",
  borderRadius: dim.radiusCard,
  border: "1px solid",
  borderColor: "divider",
  boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
};

// ─── 페이지 레이아웃 ─────────────────────────────────────────
export const pagePadding: SxProps<Theme> = {
  px: { xs: 2, sm: 4, md: 8 },
  py: { xs: 3, md: 5 },
};

export const pageWithSidebar: SxProps<Theme> = {
  display: "flex",
  gap: { md: 6, lg: 8 },
  alignItems: "flex-start",
};

export const sidebarWidth: SxProps<Theme> = {
  width: { md: 300, lg: 340 },
  flexShrink: 0,
  display: { xs: "none", md: "flex" },
  flexDirection: "column",
  gap: 4,
};

export const mobileSidebar: SxProps<Theme> = {
  display: { xs: "flex", md: "none" },
  flexDirection: "column",
  gap: 3,
  mt: 4,
  pt: 4,
  borderTop: "1px solid",
  borderColor: "grey.200",
};

export const mainContent: SxProps<Theme> = {
  flex: 1,
  minWidth: 0,
};

// ─── 헤더 Toolbar ─────────────────────────────────────────────
export const toolbarInner: SxProps<Theme> = {
  maxWidth: dim.contentMaxWidth,
  width: "100%",
  mx: "auto",
  px: { xs: 2, sm: 3, md: 6 },
  gap: 2,
  minHeight: dim.appBarHeight,
};

// ─── 아티클 피드 (Medium 스타일 세로 리스트) ──────────────────
export const articleGrid: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

// ─── 아티클 카드 구분선 ───────────────────────────────────────
export const articleDivider: SxProps<Theme> = {
  borderBottom: "1px solid",
  borderColor: "grey.200",
};

// ─── 공통 버튼: 각진(square) 스타일 ─────────────────────────
// Header, LoginDialog, MobileSidebar 등 의도적으로 borderRadius:0 적용
export const squareBtn: SxProps<Theme> = {
  borderRadius: dim.radiusNone,
};
