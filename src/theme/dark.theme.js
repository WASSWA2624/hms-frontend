/**
 * Dark Theme
 * File: dark.theme.js
 */
import colors from './tokens/colors';
import spacing from './tokens/spacing';
import typography from './tokens/typography';
import radius from './tokens/radius';
import shadows from './tokens/shadows';
import breakpoints from './breakpoints';
import animations from './animations';

// Override colors for dark mode
const darkColors = {
  ...colors,
  background: {
    primary: '#000000',
    secondary: '#1C1C1E',
    tertiary: '#2C2C2E',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#EBEBF5',
    tertiary: '#8E8E93',
    inverse: '#000000',
  },
  textPrimary: '#FFFFFF',
  textSecondary: '#EBEBF5',
  onPrimary: '#FFFFFF',
};

export default {
  colors: darkColors,
  spacing,
  typography,
  radius,
  shadows,
  breakpoints,
  animations,
  mode: 'dark',
};

