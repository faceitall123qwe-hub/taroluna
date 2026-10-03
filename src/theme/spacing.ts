export const spacing = {
  xs: 4,
  sm: 10,
  md: 18,
  lg: 28,
  xl: 36,
  xxl: 52,
  xxxl: 72,
} as const;

export const borderRadius = {
  sm: 10,
  md: 14,
  lg: 22,
  xl: 36,
  full: 9999,
} as const;

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
