/**
 * Header Component Types
 * Shared types and constants for Header component
 * File: types.js
 */

/**
 * Header variants
 */
export const VARIANTS = {
  DEFAULT: 'default',
  TRANSPARENT: 'transparent',
};

/**
 * Header prop types
 * @typedef {Object} HeaderProps
 * @property {string} [variant] - Header variant (default, transparent)
 * @property {string|React.ReactNode} [logo] - Logo content (text or component)
 * @property {Function} [onSearch] - Search handler
 * @property {Function} [onMenuToggle] - Menu toggle handler
 * @property {boolean} [showSearch] - Show search bar
 * @property {boolean} [showCart] - Show cart icon
 * @property {string} [searchPlaceholder] - Search input placeholder
 * @property {string} [accessibilityLabel] - Accessibility label
 * @property {string} [testID] - Test identifier
 * @property {string} [className] - Additional CSS class (web only)
 * @property {Object} [style] - Additional styles
 */

