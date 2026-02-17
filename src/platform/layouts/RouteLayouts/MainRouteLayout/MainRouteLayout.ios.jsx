/**
 * MainRouteLayout Component - iOS
 * Reusable route layout for authenticated/main app routes on iOS (matches mobile web)
 * File: MainRouteLayout.ios.jsx
 */

import React, { useMemo } from 'react';
import { Slot } from 'expo-router';
import { useI18n, useShellBanners } from '@hooks';
import { getMenuIconGlyph } from '@config/sideMenu';
import { AppFrame } from '@platform/layouts';
import {
  Breadcrumbs,
  GlobalHeader,
  LanguageControls,
  NoticeSurface,
  ShellBanners,
  TabBar,
  ThemeControls,
} from '@platform/components';
import GlobalFooter, { FOOTER_VARIANTS } from '@platform/components/navigation/GlobalFooter';
import useMainRouteLayoutNative from './useMainRouteLayoutNative';
import { useHeaderActions } from './useMainLayoutMemo';
import Brand from './Brand';
import HamburgerIcon from './HamburgerIcon';
import MobileSidebar from './MobileSidebar';
import useBreadcrumbs from './useBreadcrumbs';

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
  const breadcrumbItems = useBreadcrumbs(mainItems);
  const banners = useShellBanners();
  const bannerSlot = banners.length ? (
    <ShellBanners banners={banners} testID="main-shell-banners" />
  ) : null;
  const tabBarItems = useMemo(
    () =>
      mainItems.map((item) => ({
        ...item,
        href: item.path,
        label: item.label || item.name || item.id,
        icon: getMenuIconGlyph(item.icon),
      })),
    [mainItems]
  );

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
  const headerUtilitySlot = (
    <>
      <LanguageControls
        testID="main-language-controls"
        accessibilityLabel={t('settings.language.accessibilityLabel')}
        accessibilityHint={t('settings.language.hint')}
      />
      <ThemeControls
        testID="main-theme-controls"
        accessibilityLabel={t('settings.theme.accessibilityLabel')}
        accessibilityHint={t('settings.theme.hint')}
      />
    </>
  );
  const breadcrumbsSlot = breadcrumbItems.length ? (
    <Breadcrumbs
      items={breadcrumbItems}
      testID="main-breadcrumbs"
      accessibilityLabel={t('navigation.breadcrumbs.title')}
    />
  ) : null;

  return (
    <>
      <AppFrame
        header={
          <GlobalHeader
            title={brandTitle}
            accessibilityLabel={t('navigation.header.title')}
            testID="main-header"
            actions={headerActions}
            utilitySlot={headerUtilitySlot}
          />
        }
        footer={
          <GlobalFooter
            variant={FOOTER_VARIANTS.MINIMAL}
            accessibilityLabel={t('navigation.footer.title')}
            testID="main-footer"
            quickActionsSlot={(
              <TabBar
                accessibilityLabel={t('navigation.tabBar.title')}
                items={tabBarItems}
                isTabVisible={isItemVisible}
                testID="main-tabbar"
              />
            )}
          />
        }
        banner={bannerSlot}
        breadcrumbs={breadcrumbsSlot}
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

