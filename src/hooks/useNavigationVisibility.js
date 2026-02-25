/**
 * useNavigationVisibility Hook
 * Auth-based visibility for nav items (used with items from config/sideMenu).
 * File: useNavigationVisibility.js
 */
import { useCallback, useMemo } from 'react';
import useAuth from '@hooks/useAuth';
import usePatientAccess from '@hooks/usePatientAccess';
import useResolvedRoles from '@hooks/useResolvedRoles';
import { isGlobalAdminRole, resolveCanonicalRoles, ROLE_KEYS } from '@config/accessPolicy';
import { normalizeRoleKey } from './roleUtils';

const resolveRequiredRoles = (item) => {
  if (!item) return [];
  if (Array.isArray(item.roles)) return item.roles;
  if (item.roles) return [item.roles];
  return [];
};

const firstTruthy = (values = []) =>
  values.find((candidate) => candidate !== undefined && candidate !== null);

const toOptionalId = (value) => {
  const normalized = value != null ? String(value).trim() : '';
  return normalized || null;
};

const resolveTenantId = (user) =>
  toOptionalId(
    firstTruthy([
      user?.tenant_id,
      user?.tenantId,
      user?.tenant?.id,
      user?.tenant?.tenant_id,
      user?.profile?.tenant_id,
      user?.profile?.tenantId,
      user?.profile?.tenant?.id,
      user?.profile?.tenant?.tenant_id,
      user?.currentTenantId,
      user?.login_user_tenant_id,
      user?.loginUserTenantId,
    ])
  );

/**
 * @returns {Object} isItemVisible(item) - true when authenticated and item is truthy
 */
const useNavigationVisibility = () => {
  const { isAuthenticated, user } = useAuth();
  const { canAccessPatients, canAccessPatientLegalHub } = usePatientAccess();
  const { roles, isResolved } = useResolvedRoles();

  const roleSet = useMemo(
    () => new Set((roles || []).map((role) => normalizeRoleKey(role)).filter(Boolean)),
    [roles]
  );
  const canonicalRoles = useMemo(() => resolveCanonicalRoles(roles), [roles]);
  const canManageAllTenants = useMemo(
    () => isGlobalAdminRole(canonicalRoles),
    [canonicalRoles]
  );
  const tenantId = useMemo(() => resolveTenantId(user), [user]);
  const hasTenantScope = canManageAllTenants || Boolean(tenantId);

  const hasRoleAccess = useCallback(
    (item) => {
      const requiredRoles = resolveRequiredRoles(item);
      if (requiredRoles.length === 0) return true;
      if (!isResolved) return false;
      return requiredRoles.some((role) => roleSet.has(normalizeRoleKey(role)));
    },
    [isResolved, roleSet]
  );

  const hasScopeAccess = useCallback(
    (item) => {
      const path = String(item?.path || '').trim();
      if (!path) return true;
      if (path === '/dashboard' || path.startsWith('/settings')) return true;

      const requiredRoles = resolveRequiredRoles(item)
        .map((role) => normalizeRoleKey(role))
        .filter(Boolean);
      const isPatientOnlyRoute =
        requiredRoles.length > 0 && requiredRoles.every((role) => role === ROLE_KEYS.PATIENT);
      if (isPatientOnlyRoute) return true;

      return hasTenantScope;
    },
    [hasTenantScope]
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
    (item) =>
      Boolean(item && isAuthenticated && hasRoleAccess(item) && hasPathAccess(item) && hasScopeAccess(item)),
    [isAuthenticated, hasPathAccess, hasRoleAccess, hasScopeAccess]
  );

  return { isItemVisible };
};

export default useNavigationVisibility;
