import { SxProps, Theme } from "@mui/material/styles";

// ─── Font Size ───────────────────────────────────────────────
export const fs = {
  xs:   "10px",
  sm:   "12px",
  md:   "14px",
  lg:   "15px",
  xl:   "16px",
  "2xl": "18px",
  "3xl": "20px",
  "4xl": "24px",
  "5xl": "28px",
  "6xl": "32px",
  display: "72px",
} as const;

// ─── Font Weight ─────────────────────────────────────────────
export const fw = {
  normal: 400,
  bold:   700,
} as const;

// ─── Line Height ─────────────────────────────────────────────
export const lh = {
  relaxed: 1.8,
} as const;

// ─── Text sx presets ─────────────────────────────────────────
export const textPrimary:   SxProps<Theme> = { fontSize: fs.md, color: "text.primary" };
export const textSecondary: SxProps<Theme> = { fontSize: fs.sm, color: "text.secondary" };
export const labelBold:     SxProps<Theme> = { fontSize: fs.md, fontWeight: fw.bold, color: "text.primary" };
export const titleLg:       SxProps<Theme> = { fontSize: { xs: fs["2xl"], md: fs["4xl"] }, fontWeight: fw.bold, color: "text.primary" };
export const titleMd:       SxProps<Theme> = { fontSize: fs.xl,  fontWeight: fw.bold };
export const titleSm:       SxProps<Theme> = { fontSize: fs.lg,  fontWeight: fw.bold, color: "text.primary" };
export const captionText:   SxProps<Theme> = { fontSize: fs.sm, color: "text.secondary" };

// ─── Dimension tokens ────────────────────────────────────────
export const dim = {
  // 컴포넌트 치수
  avatarSize:       48,
  followBtnHeight:  28,
  followBtnMinW:    56,
  inputRowHeight:   40,
  badgeHeight:      24,
  thumbnailWidth:   { xs: 96, md: 120 },
  tradeInfoLabelW:  36,
  tagInputMinW:     60,

  // 앱바 / 헤더
  appBarHeight:     "64px !important",
  drawerWidth:      240,
  searchWidth:      "480px",
  searchBorderRadius: "16px",

  // 레이아웃
  contentMaxWidth:  "1440px",

  // border radius
  radiusPill:       "20px",
  radiusTag:        "12px",
  radiusCard:       "10px",
} as const;

// ─── Common button sx presets ────────────────────────────────
export const btnDark: SxProps<Theme> = {
  bgcolor: "grey.900",
  color: "white",
  borderRadius: 2,
  fontSize: fs.sm,
  fontWeight: fw.bold,
  py: 1.5,
  "&:hover": { bgcolor: "grey.800" },
};

export const btnPill: SxProps<Theme> = {
  bgcolor: "grey.900",
  color: "white",
  borderRadius: "20px",
  fontSize: fs.sm,
  fontWeight: fw.bold,
  px: 3,
  "&:hover": { bgcolor: "grey.800" },
};

// ─── Common chip/badge sx ────────────────────────────────────
export const badgeChip: SxProps<Theme> = {
  fontWeight: fw.bold,
  fontSize: fs.xs,
  height: dim.badgeHeight,
  borderRadius: 1,
};
