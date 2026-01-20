/**
 * Navigation Components Types
 * Shared types and constants for navigation components
 * File: types.js
 */

/**
 * Header component types
 */
const HEADER_VARIANTS = {
  DEFAULT: 'default',
  TRANSPARENT: 'transparent',
};

/**
 * Sidebar navigation item
 * @typedef {Object} SidebarNavItem
 * @property {string} id - Unique identifier
 * @property {string} label - Display label
 * @property {string} href - Route path
 * @property {string} [icon] - Icon name or component
 * @property {string[]} [roles] - Allowed roles (buyer, vendor, admin)
 * @property {SidebarNavItem[]} [children] - Nested items
 * @property {boolean} [badge] - Show badge indicator
 * @property {number} [badgeCount] - Badge count
 */

/**
 * Tab bar item
 * @typedef {Object} TabBarItem
 * @property {string} id - Unique identifier
 * @property {string} label - Display label
 * @property {string} href - Route path
 * @property {string} [icon] - Icon name or component
 * @property {boolean} [badge] - Show badge indicator
 * @property {number} [badgeCount] - Badge count
 */

export { HEADER_VARIANTS };

