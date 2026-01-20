/**
 * MainRouteLayout Component - iOS
 * Reusable route layout for authenticated/main app routes on iOS
 * File: MainRouteLayout.ios.jsx
 * 
 * Per component-structure.mdc: Reusable layout components belong in platform/layouts/
 * Per app-router.mdc: Route layouts handle authentication guards
 * 
 * This component combines:
 * - Auth guard (routing logic)
 * - MainLayout (UI component)
 * - Navigation components (Header, TabBar)
 * - Slot rendering (child routes)
 */

import React from 'react';
import { Slot } from 'expo-router';
import { useAuthGuard } from '@navigation/guards';
import { MainLayout } from '@platform/layouts';
import { Header, TabBar } from '@platform/components';

/**
 * MainRouteLayout component for iOS
 * @param {Object} props - MainRouteLayout props
 */
const MainRouteLayoutIOS = () => {
  // Call auth guard at the top of component per app-router.mdc
  // Hook automatically redirects unauthenticated users to /login
  useAuthGuard();
  
  // Use platform MainLayout component with Header, TabBar, and Slot
  return (
    <MainLayout
      header={
        <Header
          accessibilityLabel="Main navigation header"
          testID="main-header"
        />
      }
      footer={
        <TabBar
          accessibilityLabel="Main navigation tab bar"
          testID="main-tabbar"
        />
      }
      accessibilityLabel="Main navigation"
      testID="main-route-layout"
    >
      <Slot />
    </MainLayout>
  );
};

export default MainRouteLayoutIOS;

