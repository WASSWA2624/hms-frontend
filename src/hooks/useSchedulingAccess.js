/**
 * useSchedulingAccess Hook
 * Centralized scheduling route/action access policy with tenant/facility context.
 */
import { useMemo } from 'react';
import useAuth from './useAuth';
import useResolvedRoles from './useResolvedRoles';
import { normalizeRoleKey } from './roleUtils';

const GLOBAL_ADMIN_ROLES = ['APP_ADMIN', 'SUPER_ADMIN'];
const SCHEDULING_ACCESS_ROLES = [
  'TENANT_ADMIN',
  'ADMIN',
  'DOCTOR',
  'NURSE',
  'CLINICAL_OFFICER',
  'FRONT_DESK',
  'RECEPTIONIST',
  'EMERGENCY_OFFICER',
];
const SCHEDULING_WRITE_ROLES = [
  'TENANT_ADMIN',
  'ADMIN',
  'DOCTOR',
  'NURSE',
  'CLINICAL_OFFICER',
  'FRONT_DESK',
  'RECEPTIONIST',
];
const SCHEDULING_DELETE_ROLES = ['TENANT_ADMIN', 'ADMIN'];

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

const resolveFacilityId = (user) => {
  const candidates = [
    user?.facility_id,
    user?.facilityId,
    user?.facility?.id,
    user?.facility?.facility_id,
    user?.profile?.facility_id,
    user?.profile?.facilityId,
  ];
  const value = candidates.find((candidate) => candidate !== undefined && candidate !== null);
  const normalized = value != null ? String(value).trim() : '';
  return normalized || null;
};

const hasAnyRole = (roleSet, requiredRoles) => requiredRoles.some((role) => roleSet.has(role));

const useSchedulingAccess = () => {
  const { user } = useAuth();
  const { roles, isResolved } = useResolvedRoles();

  const roleSet = useMemo(
    () => new Set((roles || []).map((role) => normalizeRoleKey(role)).filter(Boolean)),
    [roles]
  );

  const canManageAllTenants = hasAnyRole(roleSet, GLOBAL_ADMIN_ROLES);
  const canAccessScheduling = canManageAllTenants || hasAnyRole(roleSet, SCHEDULING_ACCESS_ROLES);
  const canManageSchedulingRecords = canManageAllTenants || hasAnyRole(roleSet, SCHEDULING_WRITE_ROLES);
  const canDeleteSchedulingRecords = canManageAllTenants || hasAnyRole(roleSet, SCHEDULING_DELETE_ROLES);
  const tenantId = resolveTenantId(user);
  const facilityId = resolveFacilityId(user);

  return {
    canAccessScheduling,
    canManageSchedulingRecords,
    canCreateSchedulingRecords: canManageSchedulingRecords,
    canEditSchedulingRecords: canManageSchedulingRecords,
    canCancelAppointments: canManageSchedulingRecords,
    canDeleteSchedulingRecords,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  };
};

export default useSchedulingAccess;
