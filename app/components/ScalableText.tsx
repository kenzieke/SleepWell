import React from 'react';
import { Text, TextProps } from 'react-native';

interface ScalableTextProps extends TextProps {
  maxScale?: number;
}

/**
 * A Text component that supports Dynamic Type with a configurable maximum scale.
 * This prevents layouts from breaking at extremely large accessibility text sizes
 * while still respecting the user's text size preferences.
 *
 * @param maxScale - Maximum font size multiplier (default: 1.5)
 */
const ScalableText: React.FC<ScalableTextProps> = ({
  maxScale = 1.5,
  children,
  ...props
}) => {
  return (
    <Text
      allowFontScaling={true}
      maxFontSizeMultiplier={maxScale}
      {...props}
    >
      {children}
    </Text>
  );
};

export default ScalableText;
