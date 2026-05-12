import { SxProps, Theme } from "@mui/material/styles";
import { dim } from "./typography";

// 카드 (FeaturedCard, ItemCard)
export const cardBase: SxProps<Theme> = {
  width: "100%",
  borderRadius: 3,
  overflow: "hidden",
  bgcolor: "white",
  boxShadow: 1,
  cursor: "pointer",
  transition: "box-shadow 0.2s",
  "&:hover": { boxShadow: 4 },
};

export const cardImage: SxProps<Theme> = {
  width: "100%",
  bgcolor: "grey.300",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

// 패널 (ArticleTrade, ArticleEditorProfile, TodayEditors, WriteSaleSettings)
export const panelBase: SxProps<Theme> = {
  bgcolor: "white",
  borderRadius: 3,
  boxShadow: 1,
};

// 페이지 레이아웃
export const pagePadding: SxProps<Theme> = {
  px: { xs: 2, sm: 4, md: 8 },
  py: { xs: 3, md: 5 },
};

export const pageWithSidebar: SxProps<Theme> = {
  display: "flex",
  gap: 4,
  alignItems: "flex-start",
};

export const sidebarWidth: SxProps<Theme> = {
  width: { md: 360, lg: 460 },
  flexShrink: 0,
  display: { xs: "none", md: "flex" },
  flexDirection: "column",
  gap: 3,
};

export const mobileSidebar: SxProps<Theme> = {
  display: { xs: "flex", md: "none" },
  flexDirection: "column",
  gap: 3,
  mt: 3,
};

export const mainContent: SxProps<Theme> = {
  flex: 1,
  minWidth: 0,
};

// ─── 헤더 Toolbar (maxWidth 중앙 정렬) ───────────────────────
export const toolbarInner: SxProps<Theme> = {
  maxWidth: dim.contentMaxWidth,
  width: "100%",
  mx: "auto",
  px: { xs: 2, sm: 3, md: 6 },
  gap: 2,
  minHeight: dim.appBarHeight,
};

// ─── 아티클 그리드 (반응형 1→2→3열) ─────────────────────────
export const articleGrid: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
  gap: 3,
};
