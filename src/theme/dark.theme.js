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
    primary: '#0F1115',
    secondary: '#171A1F',
    tertiary: '#20242B',
    surface: '#171A1F',
  },
  surface: {
    primary: '#171A1F',
    secondary: '#20242B',
    tertiary: '#2A3039',
  },
  border: {
    light: '#2E3540',
    medium: '#3D4652',
    strong: '#4FA3FF',
  },
  text: {
    primary: '#F3F3F3',
    secondary: '#C8CBD1',
    tertiary: '#8A9099',
    inverse: '#0F1115',
  },
  textPrimary: '#F3F3F3',
  textSecondary: '#C8CBD1',
  onPrimary: '#FFFFFF',
  status: {
    ...colors.status,
    error: {
      background: '#2A1214',
      text: '#FFB4AB',
    },
    warning: {
      background: '#2A1C10',
      text: '#FFD7A0',
    },
  },
  tooltip: {
    background: 'rgba(23, 26, 31, 0.95)',
    text: '#F3F3F3',
  },
  overlay: {
    ...colors.overlay,
    sheetBackdrop: 'rgba(0, 0, 0, 0.55)',
  },
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

