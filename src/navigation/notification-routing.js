/**
 * Notification routing helpers
 * Shared helpers for notification route resolution and UI metadata.
 * File: notification-routing.js
 */

const normalizeRoute = (value) => {
  if (typeof value !== 'string') return '/';
  const withoutQuery = value.split('?')[0].split('#')[0];
  const trimmed = withoutQuery.trim();
  if (!trimmed) return '/';
  const withLeading = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  if (withLeading.length > 1 && withLeading.endsWith('/')) {
    return withLeading.slice(0, -1);
  }
  return withLeading;
};

const hasPathMatch = (pathname, candidatePath) =>
  pathname === candidatePath || pathname.startsWith(`${candidatePath}/`);

const flattenNavigation = (items) => {
  const flat = [];
  (items || []).forEach((item) => {
    if (item?.path) {
      flat.push({
        item,
        parent: null,
        path: normalizeRoute(item.path),
      });
    }

    const children = Array.isArray(item?.children) ? item.children : [];
    children.forEach((child) => {
      if (!child?.path) return;
      flat.push({
        item: child,
        parent: item,
        path: normalizeRoute(child.path),
      });
    });
  });
  return flat;
};

const getNotificationType = (notification) =>
  String(notification?.notification_type || notification?.type || '')
    .trim()
    .toUpperCase();

const resolveNotificationIcon = (notification) => {
  const type = getNotificationType(notification);
  const routeHint = String(
    notification?.target_path || notification?.route || notification?.path || ''
  ).toLowerCase();
  if (routeHint.startsWith('/ipd')) return '\u{1F6CF}';
  if (routeHint.startsWith('/scheduling/opd-flows') || routeHint.startsWith('/clinical')) return '\u2695';
  if (routeHint.startsWith('/radiology')) return '\u{1F5BB}';
  if (type === 'APPOINTMENT') return '\u{1F4C5}';
  if (type === 'BILLING') return '\u{1F4B3}';
  if (type === 'LAB') return '\u{1F9EA}';
  if (type === 'RADIOLOGY') return '\u{1F5BB}';
  if (type === 'PHARMACY') return '\u{1F48A}';
  if (type === 'OPD') return '\u2695';
  if (type === 'IPD') return '\u{1F6CF}';
  if (type === 'SYSTEM') return '\u26A0';
  return '\u{1F514}';
};

const isNotificationUnread = (notification) => {
  if (typeof notification?.is_read === 'boolean') return !notification.is_read;
  if (typeof notification?.read === 'boolean') return !notification.read;
  return !(notification?.read_at || notification?.readAt);
};

const resolveNotificationMessage = (notification) =>
  typeof notification?.message === 'string' ? notification.message.trim() : '';

const resolveNotificationTimestamp = (notification) => {
  const value =
    notification?.created_at ||
    notification?.createdAt ||
    notification?.updated_at ||
    notification?.updatedAt ||
    notification?.read_at ||
    notification?.readAt ||
    null;

  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const formatNotificationMeta = (notification) => {
  const message = resolveNotificationMessage(notification);
  if (message) return message;

  const timestamp = resolveNotificationTimestamp(notification);
  if (!timestamp) return '';
  return timestamp.toLocaleString();
};

const pushRouteCandidate = (list, value) => {
  if (typeof value !== 'string') return;
  const trimmed = value.trim();
  if (!trimmed.startsWith('/')) return;
  list.push(normalizeRoute(trimmed));
};

const isOpdNotificationContext = (notification) => {
  const type = getNotificationType(notification);
  if (type === 'OPD') return true;

  const text = `${notification?.title || ''} ${notification?.message || ''}`
    .trim()
    .toLowerCase();
  if (!text) return false;

  return (
    text.includes('opd') ||
    text.includes('consultation') ||
    text.includes('vitals') ||
    text.includes('triage') ||
    text.includes('doctor review') ||
    text.includes('disposition')
  );
};

const isIpdNotificationContext = (notification) => {
  const type = getNotificationType(notification);
  if (type === 'IPD') return true;

  const routeHint = String(
    notification?.target_path || notification?.route || notification?.path || ''
  )
    .trim()
    .toLowerCase();
  if (routeHint.startsWith('/ipd')) return true;

  const text = `${notification?.title || ''} ${notification?.message || ''}`
    .trim()
    .toLowerCase();
  if (!text) return false;

  return (
    text.includes('ipd') ||
    text.includes('inpatient') ||
    text.includes('admission') ||
    text.includes('bed') ||
    text.includes('ward') ||
    text.includes('transfer') ||
    text.includes('discharge')
  );
};

const shouldAutoMarkNotificationRead = (notification) =>
  !isOpdNotificationContext(notification) && !isIpdNotificationContext(notification);

const buildNotificationRouteCandidates = (
  notification,
  { fallbackRoute = '/communications/notifications' } = {}
) => {
  const candidates = [];
  pushRouteCandidate(candidates, notification?.target_path);
  pushRouteCandidate(candidates, notification?.route);
  pushRouteCandidate(candidates, notification?.path);
  pushRouteCandidate(candidates, notification?.target_url);
  pushRouteCandidate(candidates, notification?.action_url);
  pushRouteCandidate(candidates, notification?.link);

  const text = `${notification?.title || ''} ${notification?.message || ''}`
    .trim()
    .toLowerCase();
  if (text.includes('breach') || text.includes('compliance') || text.includes('phi')) {
    pushRouteCandidate(candidates, '/compliance/breach-notifications');
  }
  if (text.includes('message') || text.includes('conversation') || text.includes('chat')) {
    pushRouteCandidate(candidates, '/communications/messages');
  }
  if (isOpdNotificationContext(notification)) {
    pushRouteCandidate(candidates, '/clinical');
  }
  if (isIpdNotificationContext(notification)) {
    pushRouteCandidate(candidates, '/ipd');
  }
  if (text.includes('appointment') || text.includes('visit')) {
    pushRouteCandidate(candidates, '/scheduling/appointments');
  }
  if (text.includes('invoice') || text.includes('payment') || text.includes('billing')) {
    pushRouteCandidate(candidates, '/billing/invoices');
  }
  if (text.includes('lab') || text.includes('sample') || text.includes('result')) {
    pushRouteCandidate(candidates, '/lab/results');
  }
  if (
    text.includes('radiology') ||
    text.includes('imaging') ||
    text.includes('dicom') ||
    text.includes('pacs') ||
    text.includes('study')
  ) {
    pushRouteCandidate(candidates, '/radiology');
  }
  if (text.includes('pharmacy') || text.includes('drug') || text.includes('dispense')) {
    pushRouteCandidate(candidates, '/pharmacy/pharmacy-orders');
  }
  if (text.includes('stock') || text.includes('inventory') || text.includes('supply')) {
    pushRouteCandidate(candidates, '/inventory/inventory-items');
  }

  const type = getNotificationType(notification);
  if (type === 'APPOINTMENT') pushRouteCandidate(candidates, '/scheduling/appointments');
  if (type === 'BILLING') pushRouteCandidate(candidates, '/billing/invoices');
  if (type === 'LAB') pushRouteCandidate(candidates, '/lab/results');
  if (type === 'RADIOLOGY') pushRouteCandidate(candidates, '/radiology');
  if (type === 'PHARMACY') pushRouteCandidate(candidates, '/pharmacy/pharmacy-orders');
  if (type === 'OPD') pushRouteCandidate(candidates, '/clinical');
  if (type === 'IPD') pushRouteCandidate(candidates, '/ipd');
  if (type === 'SYSTEM') pushRouteCandidate(candidates, '/dashboard');

  if (fallbackRoute) pushRouteCandidate(candidates, fallbackRoute);

  return [...new Set(candidates)];
};

const resolveNotificationRoute = (
  notification,
  canAccessRoute,
  options = {}
) => {
  const directTargetPath =
    typeof notification?.target_path === 'string' && notification.target_path.trim().startsWith('/')
      ? normalizeRoute(notification.target_path)
      : null;
  if (directTargetPath) {
    if (typeof canAccessRoute !== 'function' || canAccessRoute(directTargetPath)) {
      return directTargetPath;
    }
  }

  const candidates = buildNotificationRouteCandidates(notification, options);
  if (typeof canAccessRoute !== 'function') return candidates[0] || null;
  return candidates.find((route) => canAccessRoute(route)) || null;
};

export {
  normalizeRoute,
  hasPathMatch,
  flattenNavigation,
  getNotificationType,
  resolveNotificationIcon,
  isNotificationUnread,
  isOpdNotificationContext,
  isIpdNotificationContext,
  shouldAutoMarkNotificationRead,
  resolveNotificationMessage,
  resolveNotificationTimestamp,
  formatNotificationMeta,
  buildNotificationRouteCandidates,
  resolveNotificationRoute,
};
