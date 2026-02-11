/**
 * Route persistence helpers
 * Keeps last visited path for resume behavior.
 */
import { async as asyncStorage } from '@services/storage';

export const LAST_ROUTE_KEY = 'hms.last_route';
export const DEFAULT_HOME_ROUTE = '/dashboard';

const normalizeRoute = (path) => {
  if (!path || typeof path !== 'string') return null;
  if (path === '/') return null;
  return path;
};

export const shouldPersistRoute = (path) => Boolean(normalizeRoute(path));

export const persistLastRoute = async (path) => {
  const normalized = normalizeRoute(path);
  if (!normalized) return false;
  return asyncStorage.setItem(LAST_ROUTE_KEY, normalized);
};

export const getLastRoute = async () => {
  const stored = await asyncStorage.getItem(LAST_ROUTE_KEY);
  return normalizeRoute(stored);
};
