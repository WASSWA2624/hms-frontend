/**
 * useNavigationVisibility Hook
 * Auth-based visibility for nav items (used with items from config/sideMenu).
 * File: useNavigationVisibility.js
 */
import { useCallback, useMemo } from 'react';
import useAuth from '@hooks/useAuth';
import useResolvedRoles from '@hooks/useResolvedRoles';
import { normalizeRoleKey } from './roleUtils';

const resolveRequiredRoles = (item) => {
  if (!item) return [];
  if (Array.isArray(item.roles)) return item.roles;
  if (item.roles) return [item.roles];
  return [];
};

/**
 * @returns {Object} isItemVisible(item) - true when authenticated and item is truthy
 */
const useNavigationVisibility = () => {
  const { isAuthenticated } = useAuth();
  const { roles, isResolved } = useResolvedRoles();

  const roleSet = useMemo(
    () => new Set((roles || []).map((role) => normalizeRoleKey(role)).filter(Boolean)),
    [roles]
  );

  const hasRoleAccess = useCallback(
    (item) => {
      const requiredRoles = resolveRequiredRoles(item);
      if (requiredRoles.length === 0) return true;
      if (!isResolved) return false;
      return requiredRoles.some((role) => roleSet.has(normalizeRoleKey(role)));
    },
    [isResolved, roleSet]
  );

  const isItemVisible = useCallback(
    (item) => Boolean(item && isAuthenticated && hasRoleAccess(item)),
    [isAuthenticated, hasRoleAccess]
  );

  return { isItemVisible };
};

export default useNavigationVisibility;
