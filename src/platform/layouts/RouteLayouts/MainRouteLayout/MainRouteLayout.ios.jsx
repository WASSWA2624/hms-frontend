/**
 * MainRouteLayout Component - iOS
 * Reusable route layout for authenticated/main app routes on iOS (matches mobile web)
 * File: MainRouteLayout.ios.jsx
 */

import React, { useMemo } from 'react';
import { Slot } from 'expo-router';
import { useI18n, useShellBanners } from '@hooks';
import { AppFrame } from '@platform/layouts';
import {
  GlobalHeader,
  LanguageControls,
  NoticeSurface,
  ShellBanners,
  ThemeControls,
} from '@platform/components';
import GlobalFooter, { FOOTER_VARIANTS } from '@platform/components/navigation/GlobalFooter';
import useMainRouteLayoutNative from './useMainRouteLayoutNative';
import { useHeaderActions } from './useMainLayoutMemo';
import Brand from './Brand';
import HamburgerIcon from './HamburgerIcon';
import MobileSidebar from './MobileSidebar';

/**
 * MainRouteLayout component for iOS
 */
const MainRouteLayoutIOS = () => {
  const { t } = useI18n();
  const {
    authHeaderActions,
    overlaySlot,
    mainItems,
    isItemVisible,
    isMobileSidebarOpen,
    handleCloseMobileSidebar,
    handleToggleSidebar,
  } = useMainRouteLayoutNative();
  const banners = useShellBanners();
  const bannerSlot = banners.length ? (
    <ShellBanners banners={banners} testID="main-shell-banners" />
  ) : null;

  const hamburgerIcon = useMemo(() => <HamburgerIcon />, []);
  const headerActions = useHeaderActions(
    authHeaderActions,
    hamburgerIcon,
    handleToggleSidebar,
    t
  );
  const brandTitle = useMemo(
    () => (
      <Brand
        appName={t('app.name')}
        appShortName={t('app.shortName')}
      />
    ),
    [t]
  );

  return (
    <>
      <AppFrame
        header={
          <GlobalHeader
            title={brandTitle}
            accessibilityLabel={t('navigation.header.title')}
            testID="main-header"
            actions={headerActions}
            utilitySlot={(
              <>
                <LanguageControls testID="main-language-controls" />
                <ThemeControls testID="main-theme-controls" />
              </>
            )}
          />
        }
        footer={
          <GlobalFooter
            variant={FOOTER_VARIANTS.MINIMAL}
            accessibilityLabel={t('navigation.footer.title')}
            testID="main-footer"
          />
        }
        banner={bannerSlot}
        overlay={overlaySlot}
        notices={<NoticeSurface testID="main-notice-surface" />}
        accessibilityLabel={t('navigation.mainNavigation')}
        testID="main-route-layout"
      >
        <Slot />
      </AppFrame>
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={handleCloseMobileSidebar}
        sidebarLabel={t('navigation.sidebar.title')}
        closeLabel={t('common.close')}
        mainItems={mainItems}
        isItemVisible={isItemVisible}
        appName={t('app.name')}
        appShortName={t('app.shortName')}
      />
    </>
  );
};

export default MainRouteLayoutIOS;

