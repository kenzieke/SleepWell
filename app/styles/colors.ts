/**
 * Centralized color palette for the SleepWell app.
 * Use these constants instead of hardcoded hex values.
 */

export const colors = {
  // Primary brand colors
  primary: '#52796F',
  primaryLight: '#84A98C',
  primaryDark: '#354F52',

  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  backgroundTertiary: '#E5E5E5',

  // Text colors
  textPrimary: '#000000',
  textSecondary: '#888888',
  textMuted: '#B0B0B0',
  textWhite: '#FFFFFF',

  // Border colors
  border: '#DDDDDD',
  borderLight: '#CCCCCC',
  borderMedium: '#BDBDBD',

  // Status colors
  error: '#FF0000',
  success: '#52796F',
  warning: '#FFA500',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.4)',

  // Transparent
  transparent: 'transparent',

  // Teal palette
  tealDeep: '#05323b',
  tealDark: '#0f5968',
  teal: '#1d7883',
  tealSoft: '#2f939b',
  aquaLight: '#50a9b5',
  aquaPale: '#78cbd0',
} as const;

export type ColorKey = keyof typeof colors;
