/**
 * ThemeControls Types
 * Shared constants for ThemeControls component
 * File: types.js
 */

/** Only light and dark per theme-design.mdc; no system or high-contrast. */
const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
};

const THEME_MODE_VALUES = Object.values(THEME_MODES);

export { THEME_MODES, THEME_MODE_VALUES };
