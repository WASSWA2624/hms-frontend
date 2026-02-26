/**
 * useNotificationsScreen Hook
 * Shared logic for NotificationsScreen across platforms.
 * File: useNotificationsScreen.js
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { MAIN_NAV_ITEMS } from '@config/sideMenu';
import {
  useAuth,
  useI18n,
  useNavigationVisibility,
  useNotification,
  useRealtimeEvent,
} from '@hooks';
import {
  flattenNavigation,
  formatNotificationMeta,
  getNotificationType,
  hasPathMatch,
  isOpdNotificationContext,
  isNotificationUnread,
  normalizeRoute,
  resolveNotificationMessage,
  resolveNotificationRoute,
  resolveNotificationTimestamp,
  shouldAutoMarkNotificationRead,
} from '@navigation/notification-routing';

const SCREEN_STATES = {
  LOADING: 'loading',
  READY: 'ready',
  ERROR: 'error',
};

const FILTERS = {
  ALL: 'all',
  UNREAD: 'unread',
  READ: 'read',
};

const NOTIFICATION_REFRESH_INTERVAL_MS = 60000;
const NOTIFICATION_PAGE_LIMIT = 50;

const resolveTypeLabelKey = (type) => {
  if (type === 'APPOINTMENT') return 'navigation.notifications.types.appointment';
  if (type === 'BILLING') return 'navigation.notifications.types.billing';
  if (type === 'LAB') return 'navigation.notifications.types.lab';
  if (type === 'PHARMACY') return 'navigation.notifications.types.pharmacy';
  if (type === 'OPD') return 'navigation.notifications.types.opd';
  if (type === 'SYSTEM') return 'navigation.notifications.types.system';
  return 'navigation.notifications.types.general';
};

const resolveTypeVariant = (type) => {
  if (type === 'APPOINTMENT') return 'primary';
  if (type === 'BILLING') return 'warning';
  if (type === 'LAB') return 'success';
  if (type === 'PHARMACY') return 'primary';
  if (type === 'OPD') return 'primary';
  if (type === 'SYSTEM') return 'warning';
  return 'primary';
};

const toNotificationItems = (
  rawNotifications,
  canAccessRoute,
  t,
  locale
) =>
  (rawNotifications || [])
    .map((notification) => {
      if (!notification?.id) return null;
      const route = resolveNotificationRoute(notification, canAccessRoute, {
        fallbackRoute: null,
      });
      if (!route) return null;

      const title =
        typeof notification?.title === 'string' && notification.title.trim()
          ? notification.title.trim()
          : t('navigation.notifications.label');
      const message =
        resolveNotificationMessage(notification) ||
        t('navigation.notifications.screen.messageFallback');
      const meta =
        formatNotificationMeta(notification) ||
        t('navigation.notifications.menuLabel');
      const timestamp = resolveNotificationTimestamp(notification);
      const type = getNotificationType(notification) || 'SYSTEM';
      const resolvedType =
        type === 'SYSTEM' && (route.startsWith('/scheduling/opd-flows') || route.startsWith('/clinical'))
          ? 'OPD'
          : type;
      const unread = isNotificationUnread(notification);
      const requiresAttention = isOpdNotificationContext(notification) || resolvedType === 'OPD';

      return {
        id: String(notification.id),
        title,
        message,
        meta,
        route,
        unread,
        requiresAttention,
        type: resolvedType,
        typeLabel: t(resolveTypeLabelKey(resolvedType)),
        typeVariant: resolveTypeVariant(resolvedType),
        timestampMs: timestamp ? timestamp.getTime() : 0,
        timestampLabel: timestamp
          ? timestamp.toLocaleString(locale)
          : t('navigation.notifications.screen.timeUnknown'),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.timestampMs - a.timestampMs);

const useNotificationsScreen = () => {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { isItemVisible } = useNavigationVisibility();
  const {
    list: listNotifications,
    markRead: markNotificationRead,
    markUnread: markNotificationUnread,
  } = useNotification();

  const [screenState, setScreenState] = useState(SCREEN_STATES.LOADING);
  const [rawNotifications, setRawNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState(FILTERS.ALL);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mutatingItemIds, setMutatingItemIds] = useState({});
  const [hasRefreshError, setHasRefreshError] = useState(false);

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

  const flattenedMainNavigation = useMemo(
    () => flattenNavigation(MAIN_NAV_ITEMS),
    []
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

  const notificationItems = useMemo(
    () => toNotificationItems(rawNotifications, canAccessRoute, t, locale),
    [canAccessRoute, locale, rawNotifications, t]
  );

  const unreadCount = useMemo(
    () => notificationItems.filter((item) => item.unread).length,
    [notificationItems]
  );
  const totalCount = notificationItems.length;

  const filteredItems = useMemo(() => {
    if (activeFilter === FILTERS.UNREAD) {
      return notificationItems.filter((item) => item.unread);
    }
    if (activeFilter === FILTERS.READ) {
      return notificationItems.filter((item) => !item.unread);
    }
    return notificationItems;
  }, [activeFilter, notificationItems]);

  const refreshNotifications = useCallback(
    async ({ silent = false } = {}) => {
      if (!isAuthenticated) {
        setRawNotifications([]);
        setScreenState(SCREEN_STATES.READY);
        setHasRefreshError(false);
        return [];
      }

      if (!silent) setScreenState(SCREEN_STATES.LOADING);

      const params = {
        page: 1,
        limit: NOTIFICATION_PAGE_LIMIT,
        sort_by: 'created_at',
        order: 'desc',
      };
      if (resolvedUserId) params.user_id = resolvedUserId;
      else if (resolvedTenantId) params.tenant_id = resolvedTenantId;

      const result = await listNotifications(params);
      if (result == null) {
        if (!silent) setScreenState(SCREEN_STATES.ERROR);
        setHasRefreshError(true);
        return null;
      }

      const items = Array.isArray(result)
        ? result
        : Array.isArray(result?.items)
          ? result.items
          : Array.isArray(result?.notifications)
            ? result.notifications
            : [];
      setRawNotifications(items);
      setScreenState(SCREEN_STATES.READY);
      setHasRefreshError(false);
      return items;
    },
    [
      isAuthenticated,
      listNotifications,
      resolvedTenantId,
      resolvedUserId,
    ]
  );

  const handleRealtimeNotification = useCallback((payload = {}) => {
    const rawNotification =
      payload?.notification && typeof payload.notification === 'object'
        ? payload.notification
        : payload;
    const notificationId = String(rawNotification?.id || '').trim();
    if (!notificationId) return;

    const normalizedNotification = {
      ...rawNotification,
      target_path: rawNotification?.target_path || payload?.target_path || null,
    };

    setRawNotifications((previous) => {
      const existingIndex = previous.findIndex(
        (notification) => String(notification?.id || '').trim() === notificationId
      );

      if (existingIndex < 0) {
        return [normalizedNotification, ...previous];
      }

      const existing = previous[existingIndex];
      const merged = {
        ...existing,
        ...normalizedNotification,
      };
      const next = [...previous];
      next.splice(existingIndex, 1);
      return [merged, ...next];
    });
  }, []);

  useRealtimeEvent('notification.created', handleRealtimeNotification, {
    enabled: isAuthenticated,
  });

  useEffect(() => {
    let active = true;
    if (!isAuthenticated) {
      setRawNotifications([]);
      setScreenState(SCREEN_STATES.READY);
      return () => {
        active = false;
      };
    }

    const load = async (options) => {
      await refreshNotifications(options);
    };

    load({ silent: false });
    const intervalId = setInterval(() => {
      if (!active) return;
      load({ silent: true });
    }, NOTIFICATION_REFRESH_INTERVAL_MS);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [isAuthenticated, refreshNotifications]);

  const setLocalReadState = useCallback((notificationId, isRead) => {
    if (!notificationId) return;
    const readAtValue = new Date().toISOString();
    setRawNotifications((prev) =>
      prev.map((notification) => {
        if (String(notification?.id) !== notificationId) return notification;
        return {
          ...notification,
          read_at: isRead ? notification?.read_at || notification?.readAt || readAtValue : null,
          readAt: isRead ? notification?.readAt || notification?.read_at || readAtValue : null,
          is_read: isRead,
          read: isRead,
        };
      })
    );
  }, []);

  const beginMutation = useCallback((notificationId) => {
    if (!notificationId) return;
    setMutatingItemIds((prev) => ({ ...prev, [notificationId]: true }));
  }, []);

  const endMutation = useCallback((notificationId) => {
    if (!notificationId) return;
    setMutatingItemIds((prev) => {
      const next = { ...prev };
      delete next[notificationId];
      return next;
    });
  }, []);

  const setReadState = useCallback(
    async (notificationId, isRead) => {
      if (!notificationId) return;
      beginMutation(notificationId);
      try {
        if (isRead) await markNotificationRead(notificationId);
        else await markNotificationUnread(notificationId);
        // Keep UI responsive even if backend mark endpoint is unavailable.
        setLocalReadState(notificationId, isRead);
      } finally {
        endMutation(notificationId);
      }
    },
    [
      beginMutation,
      endMutation,
      markNotificationRead,
      markNotificationUnread,
      setLocalReadState,
    ]
  );

  const handleOpenNotification = useCallback(
    async (item) => {
      if (!item?.id) return;
      const canAutoMarkRead = shouldAutoMarkNotificationRead(item);
      if (item.unread && canAutoMarkRead) await setReadState(item.id, true);
      router.push(item.route || '/dashboard');
    },
    [router, setReadState]
  );

  const handleToggleReadState = useCallback(
    async (item) => {
      if (!item?.id) return;
      await setReadState(item.id, item.unread);
    },
    [setReadState]
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refreshNotifications({ silent: true });
    setIsRefreshing(false);
  }, [refreshNotifications]);

  const isItemBusy = useCallback(
    (notificationId) => Boolean(mutatingItemIds[notificationId]),
    [mutatingItemIds]
  );

  return {
    t,
    screenState,
    activeFilter,
    filteredItems,
    totalCount,
    unreadCount,
    isRefreshing,
    hasRefreshError,
    setActiveFilter,
    onOpenNotification: handleOpenNotification,
    onToggleReadState: handleToggleReadState,
    onRefresh: handleRefresh,
    isItemBusy,
    FILTERS,
    SCREEN_STATES,
  };
};

export default useNotificationsScreen;
