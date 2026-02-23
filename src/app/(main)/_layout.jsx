/**
 * Main Group Route Layout
 *
 * Route layout for authenticated/main app routes (home, dashboard, etc.).
 *
 * Per app-router.mdc:
 * - Route layouts MUST stay in app/ (part of Expo App Router routing system)
 * - Route layouts use `_layout.jsx`, default exports
 * - Guard logic applied in platform route layouts
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
import { useAuthGuard, useRouteAccessGuard } from '@navigation/guards';
import { useSessionRestore } from '@hooks';
import { MainRouteLayout } from '@platform/layouts';
import { MainRouteHeaderActionsProvider } from '@platform/layouts/RouteLayouts/MainRouteLayout';

/**
 * Main group layout wrapper.
 */
function MainGroupLayout() {
  const { isReady: isSessionReady } = useSessionRestore();
  useAuthGuard({ skipRedirect: !isSessionReady });
  const { hasAccess, isPending } = useRouteAccessGuard();
  if (!isSessionReady || isPending || !hasAccess) return null;
  return (
    <MainRouteHeaderActionsProvider>
      <MainRouteLayout />
    </MainRouteHeaderActionsProvider>
  );
}

export default MainGroupLayout;

