/**
 * Main Group Route Layout
 *
 * Route layout for authenticated/main app routes (home, dashboard, etc.).
 *
 * Per app-router.mdc:
 * - Route layouts MUST stay in app/ (part of Expo App Router routing system)
 * - Route layouts use `_layout.jsx`, default exports
 * - Guard logic applied via layouts (Step 7.15: useAuthGuard in this layout)
 *
 * Per component-structure.mdc:
 * - Route layouts should be minimal wrappers that import platform layout components
 * - All layout logic belongs in platform/layouts/
 *
 * Platform resolution: Metro bundler resolves platform-specific files
 * (MainRouteLayout.web.jsx, MainRouteLayout.android.jsx, MainRouteLayout.ios.jsx)
 * when importing from the platform/layouts folder.
 */

import React from 'react';
import { useAuthGuard } from '@navigation/guards';
import { MainRouteLayout } from '@platform/layouts';

/**
 * Main group layout: applies auth guard then renders platform route layout.
 * Unauthenticated users are redirected to /welcome.
 */
function MainGroupLayout() {
  useAuthGuard({ redirectPath: '/welcome' });
  return <MainRouteLayout />;
}

export default MainGroupLayout;

