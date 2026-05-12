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
  normal:   400,
  medium:   500,
  semibold: 600,
  bold:     700,
} as const;

// ─── Line Height ─────────────────────────────────────────────
export const lh = {
  tight:   1.25,
  normal:  1.5,
  relaxed: 1.8,
} as const;

// ─── Text sx presets ─────────────────────────────────────────
export const textPrimary:   SxProps<Theme> = { fontSize: fs.md, color: "text.primary" };
export const textSecondary: SxProps<Theme> = { fontSize: fs.sm, color: "text.secondary" };
export const labelBold:     SxProps<Theme> = { fontSize: fs.md, fontWeight: fw.bold, color: "text.primary" };
export const titleLg:       SxProps<Theme> = { fontSize: { xs: fs["4xl"], md: fs["5xl"] }, fontWeight: fw.bold, color: "text.primary", lineHeight: lh.tight };
export const titleMd:       SxProps<Theme> = { fontSize: fs["2xl"], fontWeight: fw.semibold };
export const titleSm:       SxProps<Theme> = { fontSize: fs.lg, fontWeight: fw.semibold, color: "text.primary" };
export const captionText:   SxProps<Theme> = { fontSize: fs.sm, color: "text.secondary" };

// ─── Dimension tokens ────────────────────────────────────────
export const dim = {
  // 컴포넌트 치수
  avatarSize:       40,
  followBtnHeight:  32,
  followBtnMinW:    72,
  inputRowHeight:   40,
  badgeHeight:      24,
  thumbnailWidth:   { xs: 80, md: 112 },
  tradeInfoLabelW:  36,
  tagInputMinW:     60,

  // 앱바 / 헤더
  appBarHeight:     "64px !important",
  drawerWidth:      240,
  searchWidth:      "400px",
  searchBorderRadius: "20px",

  // 레이아웃
  contentMaxWidth:  "1440px",

  // border radius
  radiusPill:       "20px",
  radiusTag:        "4px",
  radiusCard:       "8px",
} as const;

// ─── Common button sx presets ────────────────────────────────
export const btnDark: SxProps<Theme> = {
  bgcolor: "grey.900",
  color: "white",
  borderRadius: 2,
  fontSize: fs.sm,
  fontWeight: fw.medium,
  py: 1.5,
  "&:hover": { bgcolor: "grey.800" },
};

export const btnPill: SxProps<Theme> = {
  bgcolor: "grey.900",
  color: "white",
  borderRadius: "20px",
  fontSize: fs.sm,
  fontWeight: fw.semibold,
  px: 3,
  "&:hover": { bgcolor: "grey.800" },
};

// ─── Common chip/badge sx ────────────────────────────────────
export const badgeChip: SxProps<Theme> = {
  fontWeight: fw.semibold,
  fontSize: fs.xs,
  height: dim.badgeHeight,
  borderRadius: 1,
};
