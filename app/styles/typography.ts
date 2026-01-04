/**
 * Centralized typography settings for the SleepWell app.
 * Use these constants for consistent text styling.
 */

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 26,
  display: 28,
  hero: 32,
} as const;

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

/**
 * Pre-composed text styles for common use cases.
 */
export const textStyles = {
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
  },
  subtitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
  },
  body: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
  },
  bodyBold: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
  },
  caption: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
  },
  button: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
  },
} as const;
