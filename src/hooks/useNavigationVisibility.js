/**
 * useNavigationVisibility Hook
 * Auth-based visibility for nav items (used with items from config/sideMenu).
 * File: useNavigationVisibility.js
 */
import { useCallback, useMemo } from 'react';
import useAuth from '@hooks/useAuth';
import usePatientAccess from '@hooks/usePatientAccess';
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
  const { canAccessPatients, canAccessPatientLegalHub } = usePatientAccess();
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

  const hasPathAccess = useCallback(
    (item) => {
      const path = String(item?.path || '').trim();
      if (!path.startsWith('/patients')) return true;
      if (path === '/patients/legal') return canAccessPatientLegalHub;
      return canAccessPatients;
    },
    [canAccessPatients, canAccessPatientLegalHub]
  );

  const isItemVisible = useCallback(
    (item) => Boolean(item && isAuthenticated && hasRoleAccess(item) && hasPathAccess(item)),
    [isAuthenticated, hasRoleAccess, hasPathAccess]
  );

  return { isItemVisible };
};

export default useNavigationVisibility;
