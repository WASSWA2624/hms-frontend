import { useMemo } from 'react';
import {
  hasScopeAccess,
  isGlobalAdminRole,
  resolveCanonicalRoles,
} from '@config/accessPolicy';
import useAuth from './useAuth';
import useResolvedRoles from './useResolvedRoles';

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
    ])
  );

const resolveFacilityId = (user) =>
  toOptionalId(
    firstTruthy([
      user?.facility_id,
      user?.facilityId,
      user?.facility?.id,
      user?.facility?.facility_id,
      user?.profile?.facility_id,
      user?.profile?.facilityId,
      user?.profile?.facility?.id,
      user?.profile?.facility?.facility_id,
    ])
  );

const resolvePatientId = (user) =>
  toOptionalId(
    firstTruthy([
      user?.patient_id,
      user?.patientId,
      user?.patient?.id,
      user?.patient?.patient_id,
      user?.profile?.patient_id,
      user?.profile?.patientId,
      user?.profile?.patient?.id,
      user?.profile?.patient?.patient_id,
    ])
  );

const useScopeAccess = (scope) => {
  const { user } = useAuth();
  const { roles, isResolved } = useResolvedRoles();

  const canonicalRoles = useMemo(() => resolveCanonicalRoles(roles), [roles]);
  const canManageAllTenants = useMemo(
    () => isGlobalAdminRole(canonicalRoles),
    [canonicalRoles]
  );
  const canRead = useMemo(
    () => hasScopeAccess(canonicalRoles, scope, 'read'),
    [canonicalRoles, scope]
  );
  const canWrite = useMemo(
    () => hasScopeAccess(canonicalRoles, scope, 'write'),
    [canonicalRoles, scope]
  );
  const canDelete = useMemo(
    () => hasScopeAccess(canonicalRoles, scope, 'delete'),
    [canonicalRoles, scope]
  );

  const tenantId = resolveTenantId(user);
  const facilityId = resolveFacilityId(user);
  const patientId = resolvePatientId(user);

  return {
    scope,
    roles: canonicalRoles,
    canRead,
    canWrite,
    canDelete,
    canManageAllTenants,
    tenantId,
    facilityId,
    patientId,
    isResolved,
  };
};

export default useScopeAccess;