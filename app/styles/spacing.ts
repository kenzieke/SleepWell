/**
 * Centralized spacing constants for the SleepWell app.
 * Use these for consistent margins, paddings, and gaps.
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 10,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  huge: 50,
} as const;

export const borderRadius = {
  sm: 5,
  md: 10,
  lg: 15,
  xl: 20,
  xxl: 25,
  round: 9999,
} as const;

export const buttonHeight = {
  sm: 32,
  md: 40,
  lg: 48,
} as const;

export type SpacingKey = keyof typeof spacing;
export type BorderRadiusKey = keyof typeof borderRadius;
