/**
 * Typography Tokens
 * File: typography.js
 * Native: single font (RN style parser). Web: CSS font stack.
 */
import { Platform } from 'react-native';

const platformOS = Platform?.OS || 'web';
const selectPlatform = (values) => {
  if (typeof Platform?.select === 'function') {
    return Platform.select(values);
  }
  return values.default;
};

const fontStack =
  platformOS === 'web'
    ? "'Segoe UI', System, -apple-system, sans-serif"
    : selectPlatform({ android: 'Roboto', default: 'System' });

export default {
  fontFamily: {
    regular: fontStack,
    medium: fontStack,
    bold: fontStack,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

