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

// ─── Letter Spacing ──────────────────────────────────────────
export const ls = {
  wide:  "0.05em",
  wider: "0.08em",
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
  radiusNone:       0,
  radiusSm:         "4px",
  radiusMd:         "6px",
  radiusLg:         "12px",
  radiusPill:       "20px",
  radiusTag:        "4px",   // dim.radiusSm 과 동일 — 태그/Chip 전용 alias
  radiusCard:       "12px",  // panelBase, WriteEditor 등 카드/패널 공통
} as const;

// ─── Common button sx presets ────────────────────────────────
export const btnDark: SxProps<Theme> = {
  bgcolor: "primary.main",
  color: "primary.contrastText",
  borderRadius: dim.radiusCard,
  fontSize: fs.sm,
  fontWeight: fw.medium,
  py: 1.5,
  "&:hover": { bgcolor: "primary.dark" },
};

export const btnPill: SxProps<Theme> = {
  bgcolor: "primary.main",
  color: "primary.contrastText",
  borderRadius: dim.radiusPill,
  fontSize: fs.sm,
  fontWeight: fw.semibold,
  px: 3,
  "&:hover": { bgcolor: "primary.dark" },
};

// ─── 팔로우 버튼 (EditorItem, FollowButton 공유) ─────────────
export const btnFollow: SxProps<Theme> = {
  fontSize: fs.sm,
  fontWeight: fw.semibold,
  borderRadius: dim.radiusPill,
  minWidth: dim.followBtnMinW,
  height: dim.followBtnHeight,
  flexShrink: 0,
};

// ─── Common chip/badge sx ────────────────────────────────────
export const badgeChip: SxProps<Theme> = {
  fontWeight: fw.semibold,
  fontSize: fs.xs,
  height: dim.badgeHeight,
  borderRadius: 1,
};
