/**
 * Main Group Route Layout
 * 
 * Route layout for authenticated/main app routes (home, dashboard, etc.).
 * 
 * Per app-router.mdc:
 * - Route layouts MUST stay in app/ (part of Expo App Router routing system)
 * - Route layouts use `_layout.jsx`, default exports
 * - This file is required by Expo Router for route group layout
 * 
 * Per component-structure.mdc:
 * - Route layouts should be minimal wrappers that import platform layout components
 * - All layout logic belongs in platform/layouts/
 * 
 * Platform resolution: Metro bundler automatically resolves platform-specific files
 * (MainRouteLayout.web.jsx, MainRouteLayout.android.jsx, MainRouteLayout.ios.jsx)
 * when importing from the platform/layouts folder.
 */

import { MainRouteLayout } from '@platform/layouts';

// Re-export platform route layout component
// Metro bundler will automatically resolve to the correct platform file
// Expo Router requires this file to exist in app/(main)/ for routing
export default MainRouteLayout;

