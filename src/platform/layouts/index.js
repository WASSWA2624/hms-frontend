/**
 * Platform Layouts Barrel Export
 * Centralized exports for all platform layouts
 * File: index.js
 */

// Main layouts
export { default as MainLayout } from './MainLayout';
export { default as AuthLayout } from './AuthLayout';
export { default as ModalLayout } from './ModalLayout';
// Frame primitives (header, footer, content slots)
export { default as AppFrame } from './AppFrame';
export { default as MainFrame } from './frames/MainFrame';
export { default as PatientFrame } from './PatientFrame';

// Route layouts (reusable route layout components)
export { default as MainRouteLayout } from './RouteLayouts/MainRouteLayout';
export { default as PatientRouteLayout } from './RouteLayouts/PatientRouteLayout';

// Common layout components
export { default as ThemeProviderWrapper } from './common/ThemeProviderWrapper';
export {
  StyledLoadingContainer,
  StyledActivityIndicator,
  StyledSlotContainer,
} from './common/RootLayoutStyles';

