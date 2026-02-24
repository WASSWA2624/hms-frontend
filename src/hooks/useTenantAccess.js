/**
 * useTenantAccess Hook
 * Centralized tenant settings RBAC policy.
 * File: useTenantAccess.js
 */
import { useMemo } from 'react';
import { SCOPE_KEYS } from '@config/accessPolicy';
import useScopeAccess from './useScopeAccess';

const useTenantAccess = () => {
  const {
    canRead,
    canWrite,
    canDelete,
    canManageAllTenants,
    tenantId,
    isResolved,
  } = useScopeAccess(SCOPE_KEYS.SETTINGS);

  const canAccessTenantSettings = canRead;
  const canCreateTenant = canManageAllTenants;
  const canEditTenant = useMemo(
    () => canManageAllTenants || canWrite,
    [canManageAllTenants, canWrite]
  );
  const canDeleteTenant = useMemo(
    () => canManageAllTenants && canDelete,
    [canDelete, canManageAllTenants]
  );

  return {
    canAccessTenantSettings,
    canManageAllTenants,
    canCreateTenant,
    canEditTenant,
    canDeleteTenant,
    canAssignTenantAdmins: canManageAllTenants,
    tenantId,
    isResolved,
  };
};

export default useTenantAccess;