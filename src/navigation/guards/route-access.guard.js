/**
 * Route Access Guard Hook
 *
 * Protects direct route navigation based on role visibility rules used by navigation items.
 */
import { useEffect, useMemo, useRef } from 'react';
import { usePathname, useRouter } from 'expo-router';
import useAuth from '@hooks/useAuth';
import useResolvedRoles from '@hooks/useResolvedRoles';
import useNavigationVisibility from '@hooks/useNavigationVisibility';
import { MAIN_NAV_ITEMS } from '@config/sideMenu';

const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const normalizePath = (value) => {
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

const getPathSegment = (value) => normalizePath(value).split('/').filter(Boolean)[0] || '';

const resolveRequiredRoles = (item) => {
  if (!item) return [];
  if (Array.isArray(item.roles)) return item.roles;
  if (item.roles) return [item.roles];
  return [];
};

const hasPathMatch = (pathname, candidatePath) =>
  pathname === candidatePath || pathname.startsWith(`${candidatePath}/`);

const resolveVisibilityTarget = (entry, pathname) => {
  if (!entry?.item) return null;
  if (entry.path === pathname) return entry.item;
  return { ...entry.item, path: pathname };
};

const flattenNavigation = (mainItems) => {
  const flat = [];
  (mainItems || []).forEach((mainItem) => {
    if (mainItem?.path) {
      flat.push({
        item: mainItem,
        parent: null,
        path: normalizePath(mainItem.path),
      });
    }
    const children = Array.isArray(mainItem?.children) ? mainItem.children : [];
    children.forEach((child) => {
      if (!child?.path) return;
      flat.push({
        item: child,
        parent: mainItem,
        path: normalizePath(child.path),
      });
    });
  });
  return flat;
};

const findBestMatchedTarget = (pathname, flatItems) => {
  let best = null;
  flatItems.forEach((entry) => {
    if (!hasPathMatch(pathname, entry.path)) return;
    if (!best || entry.path.length > best.path.length) {
      best = entry;
    }
  });
  return best;
};

const findMainBySegment = (pathname, mainItems) => {
  const segment = getPathSegment(pathname);
  if (!segment) return null;
  return (
    (mainItems || []).find((mainItem) => getPathSegment(mainItem?.path) === segment) ||
    null
  );
};

const resolveTargetForPath = (pathname, flatItems, mainItems) => {
  const bestMatchedTarget = findBestMatchedTarget(pathname, flatItems);
  if (bestMatchedTarget) return bestMatchedTarget;

  const fallbackMain = findMainBySegment(pathname, mainItems);
  if (!fallbackMain || !fallbackMain.path) return null;
  return {
    item: fallbackMain,
    parent: null,
    path: normalizePath(fallbackMain.path),
  };
};

const hasUuidLikePathIdentifier = (pathname) =>
  normalizePath(pathname)
    .split('/')
    .filter(Boolean)
    .some((segment) => UUID_LIKE_REGEX.test(String(segment).trim()));

export const ROUTE_ACCESS_GUARD_ERRORS = {
  ACCESS_DENIED: 'ACCESS_DENIED',
  UUID_LIKE_ID_BLOCKED: 'UUID_LIKE_ID_BLOCKED',
};

export function useRouteAccessGuard(options = {}) {
  const { redirectPath = '/dashboard', skipPaths = [], uuidRedirectPath = '/+not-found' } = options;
  const router = useRouter();
  const pathnameValue = usePathname();
  const pathname = useMemo(() => normalizePath(pathnameValue), [pathnameValue]);
  const { isAuthenticated } = useAuth();
  const { isResolved } = useResolvedRoles();
  const { isItemVisible } = useNavigationVisibility();
  const hasRedirected = useRef(false);

  const normalizedSkipPaths = useMemo(
    () => new Set((Array.isArray(skipPaths) ? skipPaths : []).map(normalizePath)),
    [skipPaths]
  );
  const flattenedNavigation = useMemo(() => flattenNavigation(MAIN_NAV_ITEMS), []);
  const resolvedTarget = useMemo(
    () => resolveTargetForPath(pathname, flattenedNavigation, MAIN_NAV_ITEMS),
    [flattenedNavigation, pathname]
  );
  const hasUuidPathIdentifier = useMemo(() => hasUuidLikePathIdentifier(pathname), [pathname]);

  const requiresRoleResolution = useMemo(() => {
    if (!resolvedTarget) return false;
    return (
      resolveRequiredRoles(resolvedTarget.item).length > 0 ||
      resolveRequiredRoles(resolvedTarget.parent).length > 0
    );
  }, [resolvedTarget]);

  const isPending = useMemo(
    () => Boolean(isAuthenticated && requiresRoleResolution && !isResolved),
    [isAuthenticated, isResolved, requiresRoleResolution]
  );

  const hasAccess = useMemo(() => {
    if (!isAuthenticated) return false;
    if (hasUuidPathIdentifier) return false;
    if (!resolvedTarget) return true;

    const visibilityTarget = resolveVisibilityTarget(resolvedTarget, pathname);
    if (!visibilityTarget) return false;

    if (resolvedTarget.parent && !isItemVisible(resolvedTarget.parent)) return false;
    return isItemVisible(visibilityTarget);
  }, [hasUuidPathIdentifier, isAuthenticated, isItemVisible, pathname, resolvedTarget]);

  const errorCode = useMemo(() => {
    if (isPending) return null;
    if (hasUuidPathIdentifier) return ROUTE_ACCESS_GUARD_ERRORS.UUID_LIKE_ID_BLOCKED;
    if (hasAccess) return null;
    return ROUTE_ACCESS_GUARD_ERRORS.ACCESS_DENIED;
  }, [hasAccess, hasUuidPathIdentifier, isPending]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (isPending) return;

    if (hasUuidPathIdentifier) {
      if (hasRedirected.current) return;
      hasRedirected.current = true;
      router.replace(uuidRedirectPath);
      return;
    }

    if (normalizedSkipPaths.has(pathname)) return;

    if (hasAccess) {
      hasRedirected.current = false;
      return;
    }

    if (hasRedirected.current) return;
    hasRedirected.current = true;
    router.replace(redirectPath);
  }, [
    hasAccess,
    hasUuidPathIdentifier,
    isAuthenticated,
    isPending,
    normalizedSkipPaths,
    pathname,
    redirectPath,
    router,
    uuidRedirectPath,
  ]);

  return {
    hasAccess,
    isPending,
    errorCode,
    matchedPath: resolvedTarget?.path || null,
  };
}
