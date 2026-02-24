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
import { resolveHomePath } from '@config/accessPolicy';
import { useAuth, useSessionRestore } from '@hooks';
import { MainRouteLayout } from '@platform/layouts';
import { MainRouteHeaderActionsProvider } from '@platform/layouts/RouteLayouts/MainRouteLayout';

/**
 * Main group layout wrapper.
 */
function MainGroupLayout() {
  const { isReady: isSessionReady } = useSessionRestore();
  const { roles } = useAuth();
  const homePath = resolveHomePath(roles);
  const isPatientUser = homePath === '/portal';
  useAuthGuard({ skipRedirect: !isSessionReady });
  const { hasAccess, isPending } = useRouteAccessGuard({
    redirectPath: isPatientUser ? '/portal' : '/dashboard',
  });
  if (!isSessionReady || isPending || !hasAccess || isPatientUser) return null;
  return (
    <MainRouteHeaderActionsProvider>
      <MainRouteLayout />
    </MainRouteHeaderActionsProvider>
  );
}

export default MainGroupLayout;

