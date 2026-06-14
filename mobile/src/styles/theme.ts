export const Colors = {
  ivory:        '#F5F0E8',
  ivoryDark:    '#EDE8DE',
  paper:        '#FDFAF4',
  ink:          '#1A1A1A',
  inkLight:     '#2C2C2C',
  textSecondary:'#6B6B6B',
  divider:      'rgba(0,0,0,0.08)',
  kakao:        '#FEE500',
  white:        '#FFFFFF',
  gray100:      '#F5F5F5',
  gray200:      '#E0E0E0',
  gray300:      '#BDBDBD',
  error:        '#E53935',
} as const;

export const FontSize = {
  xs:  10,
  sm:  12,
  md:  14,
  lg:  15,
  xl:  16,
  xl2: 18,
  xl3: 20,
  xl4: 24,
  xl5: 28,
  xl6: 32,
} as const;

export const FontWeight = {
  normal:   '400' as const,
  medium:   '500' as const,
  semibold: '600' as const,
  bold:     '700' as const,
};

export const Radius = {
  sm:   4,
  md:   6,
  lg:   12,
  pill: 20,
} as const;

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xl2: 24,
  xl3: 32,
} as const;
