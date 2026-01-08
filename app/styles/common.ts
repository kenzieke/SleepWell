/**
 * Common reusable style patterns for the SleepWell app.
 * These are frequently used style combinations.
 */

import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { spacing, borderRadius, buttonHeight } from './spacing';
import { fontSizes, fontWeights } from './typography';

export const commonStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Buttons
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xxl,
    height: buttonHeight.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  primaryButtonText: {
    color: colors.textWhite,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.xxl,
    height: buttonHeight.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  outlineButtonText: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
  },

  // Cards & Sections
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },

  // Dividers
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    padding: spacing.xxxl,
    alignItems: 'center',
    width: '80%',
  },
});
