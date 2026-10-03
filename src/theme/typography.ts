// Heading: Cormorant Garamond — elegant serif, highly readable for 30-60 audience
// Body: DM Sans — clean, modern, excellent legibility at small sizes
//
// Install: expo install @expo-google-fonts/cormorant-garamond @expo-google-fonts/dm-sans

export const fontFamilies = {
  heading: 'CormorantGaramond_600SemiBold',
  headingLight: 'CormorantGaramond_300Light',
  headingItalic: 'CormorantGaramond_600SemiBold_Italic',
  body: 'DMSans_400Regular',
  bodySemiBold: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
} as const;

export const typography = {
  h1: {
    fontFamily: fontFamilies.heading,
    fontSize: 42,
    lineHeight: 52,
    letterSpacing: 0.5,
  },
  h2: {
    fontFamily: fontFamilies.heading,
    fontSize: 34,
    lineHeight: 42,
    letterSpacing: 0.3,
  },
  h3: {
    fontFamily: fontFamilies.heading,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: 0.2,
  },
  body: {
    fontFamily: fontFamilies.body,
    fontSize: 17,
    lineHeight: 26,
    letterSpacing: 0,
  },
  bodySmall: {
    fontFamily: fontFamilies.body,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0,
  },
  caption: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.4,
  },
  button: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  buttonSm: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  label: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2,
  },
} as const;

export type Typography = typeof typography;
