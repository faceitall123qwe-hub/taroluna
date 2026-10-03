export const colors = {
  background: {
    primary: '#1A0A2E',   // deep indigo-purple
    secondary: '#2D1B4E', // slightly lighter purple
    card: '#231540',      // card backgrounds
    surface: '#3D2060',   // elevated surfaces
    overlay: 'rgba(26, 10, 46, 0.85)',
  },
  accent: {
    gold: '#C9A84C',
    goldLight: '#E8C87A',
    goldDim: 'rgba(201, 168, 76, 0.15)',
    rose: '#C4748A',
    purple: '#9B6FD4',
    purpleLight: '#B89AE8',
  },
  text: {
    primary: '#F0EAF8',
    secondary: '#B8A9D4',
    muted: '#7A6B9A',
    inverse: '#1A0A2E',
    gold: '#E8C87A',
  },
  status: {
    success: '#6BBF8E',
    warning: '#D4A84C',
    error: '#C46B7A',
  },
  border: {
    subtle: '#3D2060',
    medium: '#5A3A80',
    gold: '#C9A84C',
    glow: 'rgba(201, 168, 76, 0.3)',
    purpleGlow: 'rgba(155, 111, 212, 0.3)',
  },
} as const;

export type Colors = typeof colors;
