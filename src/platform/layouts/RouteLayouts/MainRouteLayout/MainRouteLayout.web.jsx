/**
 * MainRouteLayout Component - Web
 * Reusable route layout for authenticated/main app routes on Web
 * File: MainRouteLayout.web.jsx
 *
 * Per component-structure.mdc: Reusable layout components belong in platform/layouts/
 * Per app-router.mdc: Route layouts handle authentication guards
 * Per project-structure.mdc: One file = one responsibility; composition over inheritance
 */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Slot } from 'expo-router';
import { useAuthGuard } from '@navigation/guards';
import { AppFrame } from '@platform/layouts';
import {
  Breadcrumbs,
  GlobalHeader,
  Icon,
  LanguageControls,
  NoticeSurface,
  ShellBanners,
  Sidebar,
  ThemeControls,
} from '@platform/components';
import GlobalFooter, { FOOTER_VARIANTS } from '@platform/components/navigation/GlobalFooter';
import { useShellBanners } from '@hooks';
import { useHeaderActions } from './useMainLayoutMemo';
import useMainRouteLayoutWeb from './useMainRouteLayoutWeb';
import Brand from './Brand';
import HamburgerIcon from './HamburgerIcon';
import HeaderUtility from './HeaderUtility';
import MobileSidebar from './MobileSidebar';
import useBreadcrumbs from './useBreadcrumbs';
import {
  StyledHeaderRevealButton,
  StyledSidebarResizeHandle,
  StyledSidebarWrapper,
} from './MainRouteLayout.web.styles';
import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH } from './types';

const MainRouteLayoutWeb = () => {
  useAuthGuard();
  const layout = useMainRouteLayoutWeb();
  const banners = useShellBanners();
  const bannerSlot = banners.length ? (
    <ShellBanners banners={banners} testID="main-shell-banners" />
  ) : null;
  const {
    t,
    mainItems,
    isItemVisible,
    overlaySlot,
    resolvedSidebarWidth,
    isSidebarCollapsed,
    isMobile,
    isHeaderHidden,
    isMobileSidebarOpen,
    authHeaderActions,
    handleToggleSidebar,
    handleShowHeader,
    handleResizeStart,
    handleResizeKeyDown,
    handleMobileOverlayKeyDown,
    closeButtonRef,
    mobileSidebarRef,
    footerVisible,
  } = layout;
  const breadcrumbItems = useBreadcrumbs(mainItems);

  const [revealButtonPosition, setRevealButtonPosition] = useState(null);
  const revealButtonRef = useRef(null);
  const dragStartRef = useRef(null);
  const didDragRef = useRef(false);
  const justDraggedRef = useRef(false);

  const handleRevealMouseMove = useCallback((e) => {
    if (!dragStartRef.current) return;
    didDragRef.current = true;
    const { clientX, clientY, startLeft, startTop } = dragStartRef.current;
    const w = typeof window !== 'undefined' ? window.innerWidth : 400;
    const h = typeof window !== 'undefined' ? window.innerHeight : 300;
    const size = 28;
    const x = Math.max(0, Math.min(w - size, startLeft + (e.clientX - clientX)));
    const y = Math.max(0, Math.min(h - size, startTop + (e.clientY - clientY)));
    setRevealButtonPosition({ x, y });
  }, []);

  const handleRevealMouseDown = useCallback((e) => {
    if (e.button !== 0 || !revealButtonRef.current) return;
    const rect = revealButtonRef.current.getBoundingClientRect();
    dragStartRef.current = { clientX: e.clientX, clientY: e.clientY, startLeft: rect.left, startTop: rect.top };
    didDragRef.current = false;
    const onUp = () => {
      if (dragStartRef.current && didDragRef.current) justDraggedRef.current = true;
      dragStartRef.current = null;
      document.removeEventListener('mousemove', handleRevealMouseMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', handleRevealMouseMove);
    document.addEventListener('mouseup', onUp);
  }, [handleRevealMouseMove]);

  const handleRevealPress = useCallback(() => {
    if (justDraggedRef.current) {
      justDraggedRef.current = false;
      return;
    }
    handleShowHeader();
  }, [handleShowHeader]);

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

  const headerSlot = isHeaderHidden ? null : (
    <GlobalHeader
      title={brandTitle}
      accessibilityLabel={t('navigation.header.title')}
      testID="main-header"
      actions={headerActions}
      utilitySlot={(
        <>
          <LanguageControls testID="main-language-controls" />
          <ThemeControls testID="main-theme-controls" />
          <HeaderUtility {...layout} />
        </>
      )}
    />
  );

  const sidebarSlot = (
    <StyledSidebarWrapper>
      <Sidebar
        accessibilityLabel={t('navigation.sidebar.title')}
        items={mainItems}
        collapsed={isSidebarCollapsed}
        footerSlot={null}
        testID="main-sidebar"
      />
      {!isMobile && !isSidebarCollapsed ? (
        <StyledSidebarResizeHandle
          role="slider"
          aria-orientation="vertical"
          aria-label={t('navigation.sidebar.resize')}
          aria-valuemin={SIDEBAR_MIN_WIDTH}
          aria-valuemax={SIDEBAR_MAX_WIDTH}
          aria-valuenow={resolvedSidebarWidth}
          tabIndex={0}
          onMouseDown={handleResizeStart}
          onKeyDown={handleResizeKeyDown}
        />
      ) : null}
    </StyledSidebarWrapper>
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
        sidebar={sidebarSlot}
        header={headerSlot}
        footer={
          !isMobile && footerVisible ? (
            <GlobalFooter
              variant={FOOTER_VARIANTS.MAIN}
              accessibilityLabel={t('navigation.footer.title')}
              testID="main-footer"
            />
          ) : null
        }
        banner={bannerSlot}
        breadcrumbs={breadcrumbsSlot}
        overlay={overlaySlot}
        notices={<NoticeSurface testID="main-notice-surface" />}
        sidebarCollapsed={isSidebarCollapsed}
        sidebarWidth={resolvedSidebarWidth}
        collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
        accessibilityLabel={t('navigation.mainNavigation')}
        testID="main-route-layout"
      >
        <Slot />
      </AppFrame>
      {isHeaderHidden ? (
        <StyledHeaderRevealButton
          ref={revealButtonRef}
          variant="outline"
          size="small"
          dragLeft={revealButtonPosition?.x}
          dragTop={revealButtonPosition?.y}
          onMouseDown={handleRevealMouseDown}
          onPress={handleRevealPress}
          accessibilityLabel={t('navigation.header.showHeader')}
          accessibilityHint={t('navigation.header.showHeaderHint')}
          title={t('navigation.header.showHeader')}
          testID="main-header-reveal"
        >
          <Icon glyph="˅" decorative accessibilityLabel={t('navigation.header.showHeader')} />
        </StyledHeaderRevealButton>
      ) : null}
      {isMobile ? (
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={layout.handleCloseMobileSidebar}
          onKeyDown={handleMobileOverlayKeyDown}
          sidebarLabel={t('navigation.sidebar.title')}
          closeLabel={t('common.close')}
          mainItems={mainItems}
          isItemVisible={isItemVisible}
          appName={t('app.name')}
          appShortName={t('app.shortName')}
          closeButtonRef={closeButtonRef}
          panelRef={mobileSidebarRef}
        />
      ) : null}
    </>
  );
};

export default MainRouteLayoutWeb;
