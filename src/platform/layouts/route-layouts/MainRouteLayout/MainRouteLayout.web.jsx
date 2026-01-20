/**
 * MainRouteLayout Component - Web
 * Reusable route layout for authenticated/main app routes on Web
 * File: MainRouteLayout.web.jsx
 * 
 * Per component-structure.mdc: Reusable layout components belong in platform/layouts/
 * Per app-router.mdc: Route layouts handle authentication guards
 * 
 * This component combines:
 * - Auth guard (routing logic)
 * - MainLayout (UI component)
 * - Navigation components (Header, Sidebar)
 * - Slot rendering (child routes)
 */

import React from 'react';
import { Slot } from 'expo-router';
import { useAuthGuard } from '@navigation/guards';
import { MainLayout } from '@platform/layouts';
import { Header, Sidebar } from '@platform/components';

/**
 * MainRouteLayout component for Web
 * @param {Object} props - MainRouteLayout props
 */
const MainRouteLayoutWeb = () => {
  // Call auth guard at the top of component per app-router.mdc
  // Hook automatically redirects unauthenticated users to /login
  useAuthGuard();
  
  // Use platform MainLayout component with Sidebar, Header, and Slot
  return (
    <MainLayout
      sidebar={
        <Sidebar
          accessibilityLabel="Main navigation sidebar"
          testID="main-sidebar"
        />
      }
      header={
        <Header
          accessibilityLabel="Main navigation header"
          testID="main-header"
        />
      }
      accessibilityLabel="Main navigation"
      testID="main-route-layout"
    >
      <Slot />
    </MainLayout>
  );
};

export default MainRouteLayoutWeb;

