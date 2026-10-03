export { colors } from './colors';
export { typography, fontFamilies } from './typography';
export { spacing, borderRadius } from './spacing';

export type { Colors } from './colors';
export type { Typography } from './typography';
export type { Spacing, BorderRadius } from './spacing';

import { colors } from './colors';
import { typography, fontFamilies } from './typography';
import { spacing, borderRadius } from './spacing';

export const theme = {
  colors,
  typography,
  fontFamilies,
  spacing,
  borderRadius,
} as const;

export type Theme = typeof theme;
