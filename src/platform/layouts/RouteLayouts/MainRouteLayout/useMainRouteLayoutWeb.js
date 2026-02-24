/**
 * useMainRouteLayoutWeb Hook
 * Web-specific state, effects, and handlers for MainRouteLayout
 * File: useMainRouteLayoutWeb.js
 * Per component-structure.mdc: Logic in useComponentName.js
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import {
  useAuth,
  useFocusTrap,
  useI18n,
  useNavigationVisibility,
  useNotification,
  useUiState,
} from '@hooks';
import { MAIN_NAV_ITEMS } from '@config/sideMenu';
import breakpoints from '@theme/breakpoints';
import { Icon, LoadingOverlay } from '@platform/components';
import {
  useNotificationData,
  useHeaderCustomizationItems,
} from './useMainLayoutMemo';
import useKeyboardShortcuts from './useKeyboardShortcuts';
import {
  flattenNavigation,
  formatNotificationMeta,
  hasPathMatch,
  isNotificationUnread,
  normalizeRoute,
  resolveNotificationIcon,
  resolveNotificationRoute as resolveNotificationRouteCandidate,
} from '@navigation/notification-routing';
import { actions as uiActions } from '@store/slices/ui.slice';
import { SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH, SIDEBAR_DEFAULT_WIDTH, clamp } from './types';

const NOTIFICATION_PAGE_LIMIT = 8;
const NOTIFICATION_REFRESH_INTERVAL_MS = 60000;

export default function useMainRouteLayoutWeb() {
  const { t } = useI18n();
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    isLoading,
    sidebarWidth: storedSidebarWidth,
    isSidebarCollapsed: storedSidebarCollapsed,
    isHeaderHidden,
    headerActionVisibility,
    footerVisible,
  } = useUiState();
  const { isAuthenticated, logout, user } = useAuth();
  const { list: listNotifications, markRead: markNotificationRead } = useNotification();
  const { isItemVisible } = useNavigationVisibility();
  const mainItems = MAIN_NAV_ITEMS;
  const { width } = useWindowDimensions();
  const isMobile = width < breakpoints.tablet;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;
  const isDesktop = width >= breakpoints.desktop;
  const isCompactHeader = width < breakpoints.desktop;
  const resolvedUserId = useMemo(() => {
    const value = user?.id;
    if (value == null) return null;
    const normalized = String(value).trim();
    return normalized || null;
  }, [user?.id]);
  const resolvedTenantId = useMemo(() => {
    const value =
      user?.tenant_id ||
      user?.tenantId ||
      user?.tenant?.id ||
      user?.currentTenantId ||
      null;
    if (value == null) return null;
    const normalized = String(value).trim();
    return normalized || null;
  }, [user]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isOverflowOpen, setIsOverflowOpen] = useState(false);
  const [isHeaderCustomizationOpen, setIsHeaderCustomizationOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rawNotificationItems, setRawNotificationItems] = useState([]);
  const closeButtonRef = useRef(null);
  const mobileSidebarRef = useRef(null);
  const notificationsRef = useRef(null);
  const notificationsMenuRef = useRef(null);
  const overflowWrapperRef = useRef(null);
  const overflowMenuRef = useRef(null);
  const customizationWrapperRef = useRef(null);
  const customizationMenuRef = useRef(null);

  const resolvedSidebarWidth = useMemo(
    () => clamp(storedSidebarWidth ?? SIDEBAR_DEFAULT_WIDTH, SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH),
    [storedSidebarWidth]
  );
  const isSidebarCollapsed = isMobile ? true : storedSidebarCollapsed;
  const hasDocument = typeof document !== 'undefined';
  const overlaySlot = isLoading ? <LoadingOverlay visible testID="main-loading-overlay" /> : null;

  useEffect(() => {
    if (isMobile) setIsMobileSidebarOpen(false);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile && isNotificationsOpen) setIsNotificationsOpen(false);
  }, [isMobile, isNotificationsOpen]);

  useEffect(() => {
    if (isMobile && isHeaderCustomizationOpen) setIsHeaderCustomizationOpen(false);
  }, [isMobile, isHeaderCustomizationOpen]);

  useEffect(() => {
    if (!hasDocument || !isMobile) return undefined;
    document.body.style.overflow = isMobileSidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [hasDocument, isMobile, isMobileSidebarOpen]);

  useEffect(() => {
    if (!hasDocument || !isResizing) return;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [hasDocument, isResizing]);

  useEffect(() => {
    if (!hasDocument || !isNotificationsOpen) return;
    const handleClickOutside = (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hasDocument, isNotificationsOpen]);

  useEffect(() => {
    if (!hasDocument || !isOverflowOpen) return;
    const handleClickOutside = (e) => {
      if (overflowWrapperRef.current && !overflowWrapperRef.current.contains(e.target)) {
        setIsOverflowOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hasDocument, isOverflowOpen]);

  useEffect(() => {
    if (!hasDocument || !isHeaderCustomizationOpen) return;
    const handleClickOutside = (e) => {
      if (customizationWrapperRef.current && !customizationWrapperRef.current.contains(e.target)) {
        setIsHeaderCustomizationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hasDocument, isHeaderCustomizationOpen]);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    handleFullscreenChange();
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (isTablet && !isMobile && width < breakpoints.desktop && !storedSidebarCollapsed) {
      dispatch(uiActions.setSidebarCollapsed(true));
    }
  }, [isTablet, width, storedSidebarCollapsed, dispatch]);

  const handleToggleSidebar = useCallback(() => {
    if (isMobile) setIsMobileSidebarOpen((p) => !p);
    else dispatch(uiActions.setSidebarCollapsed(!storedSidebarCollapsed));
  }, [dispatch, isMobile, storedSidebarCollapsed]);

  const handleShowHeader = useCallback(() => dispatch(uiActions.setHeaderHidden(false)), [dispatch]);
  const handleHideHeader = useCallback(() => {
    setIsNotificationsOpen(false);
    setIsOverflowOpen(false);
    setIsHeaderCustomizationOpen(false);
    dispatch(uiActions.setHeaderHidden(true));
  }, [dispatch]);

  const handleToggleHeader = useCallback(() => {
    if (isHeaderHidden) handleShowHeader();
    else handleHideHeader();
  }, [isHeaderHidden, handleShowHeader, handleHideHeader]);

  const handleOpenCommandPalette = useCallback(() => setIsCommandPaletteOpen(true), []);
  const handleCloseCommandPalette = useCallback(() => setIsCommandPaletteOpen(false), []);
  const handleShowShortcuts = useCallback(() => {
    // TODO: Implement shortcuts help modal (use @logging/logger when available)
  }, []);
  const handleCloseMenus = useCallback(() => {
    setIsNotificationsOpen(false);
    setIsOverflowOpen(false);
    setIsHeaderCustomizationOpen(false);
    setIsCommandPaletteOpen(false);
  }, []);

  const handleCloseMobileSidebar = useCallback(() => setIsMobileSidebarOpen(false), []);
  const handleToggleNotifications = useCallback(() => {
    setIsOverflowOpen(false);
    setIsHeaderCustomizationOpen(false);
    setIsNotificationsOpen((p) => !p);
  }, []);
  const handleCloseNotifications = useCallback(() => setIsNotificationsOpen(false), []);
  const handleToggleOverflowMenu = useCallback(() => {
    setIsNotificationsOpen(false);
    setIsHeaderCustomizationOpen(false);
    setIsOverflowOpen((p) => !p);
  }, []);
  const handleToggleHeaderCustomization = useCallback(() => {
    setIsNotificationsOpen(false);
    setIsOverflowOpen(false);
    setIsHeaderCustomizationOpen((p) => !p);
  }, []);

  const handleNotificationsKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCloseNotifications();
      }
    },
    [handleCloseNotifications]
  );
  const handleOverflowKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOverflowOpen(false);
    }
  }, []);
  const handleCustomizationKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsHeaderCustomizationOpen(false);
    }
  }, []);

  const handleToggleHeaderActionVisibility = useCallback(
    (key) => dispatch(uiActions.toggleHeaderActionVisibility(key)),
    [dispatch]
  );

  const handleResizeStart = useCallback(
    (event) => {
      if (isMobile || isSidebarCollapsed) return;
      event.preventDefault();
      event.stopPropagation();
      setIsResizing(true);
      const startX = event.clientX;
      const startWidth = resolvedSidebarWidth;
      const handleMouseMove = (moveEvent) => {
        const delta = moveEvent.clientX - startX;
        dispatch(uiActions.setSidebarWidth(clamp(startWidth + delta, SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH)));
      };
      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [dispatch, isMobile, isSidebarCollapsed, resolvedSidebarWidth]
  );

  const handleResizeKeyDown = useCallback(
    (e) => {
      if (isMobile || isSidebarCollapsed) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const delta = e.key === 'ArrowRight' ? 12 : -12;
        dispatch(uiActions.setSidebarWidth(clamp(resolvedSidebarWidth + delta, SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH)));
      }
    },
    [dispatch, isMobile, isSidebarCollapsed, resolvedSidebarWidth]
  );

  const handleMobileOverlayKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCloseMobileSidebar();
      }
    },
    [handleCloseMobileSidebar]
  );

  const handleToggleFullscreen = useCallback(async () => {
    if (typeof document === 'undefined') return;
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (_) {}
  }, []);

  useKeyboardShortcuts(
    {
      toggleSidebar: handleToggleSidebar,
      toggleHeader: handleToggleHeader,
      openCommandPalette: handleOpenCommandPalette,
      showShortcuts: handleShowShortcuts,
      closeMenus: handleCloseMenus,
    },
    true
  );
  useFocusTrap(mobileSidebarRef, isMobileSidebarOpen, { initialFocusRef: closeButtonRef });
  useFocusTrap(notificationsMenuRef, isNotificationsOpen);
  useFocusTrap(overflowMenuRef, isOverflowOpen);
  useFocusTrap(customizationMenuRef, isHeaderCustomizationOpen);

  const headerCustomizationItems = useHeaderCustomizationItems(t);
  const isHeaderActionVisible = useCallback(
    (key) => headerActionVisibility?.[key] !== false,
    [headerActionVisibility]
  );

  const authHeaderActions = useMemo(() => [], []);

  const flattenedMainNavigation = useMemo(
    () => flattenNavigation(mainItems),
    [mainItems]
  );

  const canAccessRoute = useCallback(
    (path) => {
      const normalizedPath = normalizeRoute(path);
      let bestMatch = null;

      flattenedMainNavigation.forEach((entry) => {
        if (!hasPathMatch(normalizedPath, entry.path)) return;
        if (!bestMatch || entry.path.length > bestMatch.path.length) {
          bestMatch = entry;
        }
      });

      if (!bestMatch) return true;
      const visibilityTarget =
        bestMatch.path === normalizedPath
          ? bestMatch.item
          : { ...bestMatch.item, path: normalizedPath };
      if (bestMatch.parent && !isItemVisible(bestMatch.parent)) return false;
      return isItemVisible(visibilityTarget);
    },
    [flattenedMainNavigation, isItemVisible]
  );

  const resolveAccessibleNotificationRoute = useCallback(
    (notification) => {
      return resolveNotificationRouteCandidate(notification, canAccessRoute);
    },
    [canAccessRoute]
  );

  const notificationsIndexRoute = '/notifications';

  const normalizedNotificationItems = useMemo(
    () =>
      (rawNotificationItems || [])
        .map((notification) => {
          if (!notification?.id) return null;
          const route = resolveAccessibleNotificationRoute(notification);
          if (!route) return null;

          const title =
            typeof notification?.title === 'string' && notification.title.trim()
              ? notification.title.trim()
              : t('navigation.notifications.label');
          const meta = formatNotificationMeta(notification) || t('navigation.notifications.menuLabel');

          return {
            id: String(notification.id),
            title,
            meta,
            unread: isNotificationUnread(notification),
            icon: resolveNotificationIcon(notification),
            route,
            notification,
          };
        })
        .filter(Boolean),
    [rawNotificationItems, resolveAccessibleNotificationRoute, t]
  );
  const { notificationItems, unreadCount } = useNotificationData(normalizedNotificationItems);

  const refreshNotifications = useCallback(async () => {
    if (!isAuthenticated) return [];

    const params = {
      page: 1,
      limit: NOTIFICATION_PAGE_LIMIT,
      sort_by: 'created_at',
      order: 'desc',
    };
    if (resolvedUserId) params.user_id = resolvedUserId;
    else if (resolvedTenantId) params.tenant_id = resolvedTenantId;

    const result = await listNotifications(params);
    if (!result) return null;
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.items)) return result.items;
    return [];
  }, [isAuthenticated, listNotifications, resolvedTenantId, resolvedUserId]);

  useEffect(() => {
    let active = true;

    if (!isAuthenticated) {
      setRawNotificationItems([]);
      return () => {
        active = false;
      };
    }

    const load = async () => {
      const items = await refreshNotifications();
      if (!active || !Array.isArray(items)) return;
      setRawNotificationItems(items);
    };

    load();
    const intervalId = setInterval(load, NOTIFICATION_REFRESH_INTERVAL_MS);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [isAuthenticated, refreshNotifications]);

  useEffect(() => {
    if (!isNotificationsOpen) return;
    let active = true;

    const load = async () => {
      const items = await refreshNotifications();
      if (!active || !Array.isArray(items)) return;
      setRawNotificationItems(items);
    };

    load();
    return () => {
      active = false;
    };
  }, [isNotificationsOpen, refreshNotifications]);

  const handleNotificationSelect = useCallback(
    async (event, selectedItem) => {
      const notificationId = String(
        selectedItem?.id || event?.currentTarget?.dataset?.notificationId || ''
      ).trim();
      const resolvedItem =
        selectedItem || notificationItems.find((item) => item.id === notificationId) || null;
      const targetRoute =
        resolvedItem?.route ||
        resolveAccessibleNotificationRoute(resolvedItem?.notification || null);

      if (notificationId && resolvedItem?.unread) {
        try {
          await markNotificationRead(notificationId);
          setRawNotificationItems((prevItems) =>
            prevItems.map((notification) =>
              String(notification?.id) === notificationId
                ? {
                    ...notification,
                    read_at:
                      notification?.read_at ||
                      notification?.readAt ||
                      new Date().toISOString(),
                    is_read: true,
                    read: true,
                  }
                : notification
            )
          );
        } catch {
          // Ignore mark-read failures so navigation remains responsive.
        }
      }

      setIsNotificationsOpen(false);
      if (isMobile) setIsOverflowOpen(false);

      if (targetRoute) {
        router.push(targetRoute);
      }
    },
    [
      isMobile,
      markNotificationRead,
      notificationItems,
      resolveAccessibleNotificationRoute,
      router,
    ]
  );

  const handleViewNotifications = useCallback(() => {
    router.push(notificationsIndexRoute);
    setIsNotificationsOpen(false);
    setIsOverflowOpen(false);
  }, [notificationsIndexRoute, router]);

  const shouldShowNotifications = isHeaderActionVisible('notifications');
  const shouldShowNetwork = isHeaderActionVisible('network');
  const shouldShowDatabase = isHeaderActionVisible('database');
  const shouldShowNotificationsInline = !isMobile && shouldShowNotifications;
  const shouldShowFullscreenInline = isHeaderActionVisible('fullscreen') && !isCompactHeader && !isMobile;
  const shouldShowFullscreenOverflow = isHeaderActionVisible('fullscreen') && (isCompactHeader || isMobile);
  const fullscreenLabel = isFullscreen ? t('navigation.fullscreen.exit') : t('navigation.fullscreen.enter');
  const fullscreenIconGlyph = isFullscreen ? '\u{1F5D7}' : '\u26F6';

  const overflowItems = useMemo(
    () =>
      isMobile
        ? []
        : shouldShowFullscreenOverflow
          ? [{ id: 'fullscreen', label: fullscreenLabel, onPress: handleToggleFullscreen, icon: fullscreenIconGlyph }]
          : [],
    [fullscreenIconGlyph, fullscreenLabel, handleToggleFullscreen, isMobile, shouldShowFullscreenOverflow]
  );

  const shouldShowOverflowMenu = isMobile || overflowItems.length > 0;
  const fullscreenIcon = useMemo(
    () => (
      <Icon
        glyph={fullscreenIconGlyph}
        decorative
        accessibilityLabel={fullscreenLabel}
      />
    ),
    [fullscreenIconGlyph, fullscreenLabel]
  );

  useEffect(() => {
    if (!shouldShowNotifications && isNotificationsOpen) setIsNotificationsOpen(false);
  }, [isNotificationsOpen, shouldShowNotifications]);

  useEffect(() => {
    if (!isMobile && overflowItems.length === 0 && isOverflowOpen) setIsOverflowOpen(false);
  }, [isMobile, isOverflowOpen, overflowItems.length]);

  const handleOverflowItemPress = useCallback(async (item) => {
    if (item?.onPress) await item.onPress();
    setIsOverflowOpen(false);
  }, []);

  const CUSTOMIZATION_ICON_MAP = useMemo(
    () => ({
      notifications: '\u{1F514}',
      network: '\u{1F4F6}',
      database: '\u{1F5C4}',
      fullscreen: '\u26F6',
    }),
    []
  );

  return {
    t,
    mainItems,
    isItemVisible,
    overlaySlot,
    resolvedSidebarWidth,
    isSidebarCollapsed,
    isMobile,
    isDesktop,
    isHeaderHidden,
    isMobileSidebarOpen,
    isNotificationsOpen,
    isOverflowOpen,
    isHeaderCustomizationOpen,
    notificationItems,
    unreadCount,
    headerCustomizationItems,
    overflowItems,
    fullscreenLabel,
    fullscreenIconGlyph,
    shouldShowNotifications,
    shouldShowNetwork,
    shouldShowDatabase,
    shouldShowNotificationsInline,
    shouldShowFullscreenInline,
    shouldShowFullscreenOverflow,
    isHeaderActionVisible,
    authHeaderActions,
    handleToggleSidebar,
    handleShowHeader,
    handleHideHeader,
    handleCloseMobileSidebar,
    handleToggleNotifications,
    handleCloseNotifications,
    handleToggleOverflowMenu,
    handleToggleHeaderCustomization,
    handleNotificationsKeyDown,
    handleOverflowKeyDown,
    handleCustomizationKeyDown,
    handleNotificationSelect,
    handleViewNotifications,
    handleToggleHeaderActionVisibility,
    handleResizeStart,
    handleResizeKeyDown,
    handleMobileOverlayKeyDown,
    handleToggleFullscreen,
    handleOverflowItemPress,
    shouldShowOverflowMenu,
    fullscreenIcon,
    closeButtonRef,
    mobileSidebarRef,
    notificationsRef,
    notificationsMenuRef,
    overflowWrapperRef,
    overflowMenuRef,
    customizationWrapperRef,
    customizationMenuRef,
    CUSTOMIZATION_ICON_MAP,
    isFullscreen,
    onLogout: logout,
    isAuthenticated,
    footerVisible,
  };
}
