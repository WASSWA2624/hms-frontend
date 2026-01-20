/**
 * Platform Layouts Barrel Export
 * Centralized exports for all platform layouts
 * File: index.js
 */

// Main layouts
export { default as MainLayout } from './MainLayout';
export { default as AuthLayout } from './AuthLayout';
export { default as ModalLayout } from './ModalLayout';

// Route layouts (reusable route layout components)
export { default as MainRouteLayout } from './route-layouts/MainRouteLayout';

// Common layout components
export { default as ThemeProviderWrapper } from './common/ThemeProviderWrapper';
export {
  StyledLoadingContainer,
  StyledActivityIndicator,
} from './common/RootLayoutStyles';

