/**
 * useTenantAccess Hook
 * Centralized tenant settings RBAC policy.
 * File: useTenantAccess.js
 */
import { useMemo } from 'react';
import useAuth from './useAuth';
import useResolvedRoles from './useResolvedRoles';
import { normalizeRoleKey } from './roleUtils';

const GLOBAL_ADMIN_ROLES = ['APP_ADMIN', 'SUPER_ADMIN'];
const TENANT_SCOPED_ROLES = ['TENANT_ADMIN', 'ADMIN'];

const resolveTenantId = (user) => {
  const candidates = [
    user?.tenant_id,
    user?.tenantId,
    user?.tenant?.id,
    user?.tenant?.tenant_id,
    user?.profile?.tenant_id,
    user?.profile?.tenantId,
  ];
  const value = candidates.find((candidate) => candidate !== undefined && candidate !== null);
  const normalized = value != null ? String(value).trim() : '';
  return normalized || null;
};

const hasAnyRole = (roleSet, requiredRoles) => requiredRoles.some((role) => roleSet.has(role));

const useTenantAccess = () => {
  const { user } = useAuth();
  const { roles, isResolved } = useResolvedRoles();

  const roleSet = useMemo(
    () => new Set((roles || []).map((role) => normalizeRoleKey(role)).filter(Boolean)),
    [roles]
  );

  const canManageAllTenants = hasAnyRole(roleSet, GLOBAL_ADMIN_ROLES);
  const isTenantScopedAdmin = hasAnyRole(roleSet, TENANT_SCOPED_ROLES);
  const tenantId = resolveTenantId(user);

  return {
    canAccessTenantSettings: canManageAllTenants || isTenantScopedAdmin,
    canManageAllTenants,
    canCreateTenant: canManageAllTenants,
    canEditTenant: canManageAllTenants || isTenantScopedAdmin,
    canDeleteTenant: canManageAllTenants,
    canAssignTenantAdmins: canManageAllTenants,
    tenantId,
    isResolved,
  };
};

export default useTenantAccess;

