/**
 * usePatientPortalAccess Hook
 * Route and action access policy for patient-facing portal routes.
 */
import { useMemo } from 'react';
import { ROLE_KEYS, SCOPE_KEYS } from '@config/accessPolicy';
import useScopeAccess from './useScopeAccess';

const usePatientPortalAccess = () => {
  const {
    roles,
    canRead,
    canWrite,
    canManageAllTenants,
    tenantId,
    facilityId,
    patientId,
    isResolved,
  } = useScopeAccess(SCOPE_KEYS.PATIENT_PORTAL);

  const isPatientSelfRole = useMemo(
    () => roles.includes(ROLE_KEYS.PATIENT),
    [roles]
  );

  const canAccessPatientPortal = canRead;
  const canManageAppointments = canWrite;
  const canCreatePayments = canWrite;

  return {
    canAccessPatientPortal,
    canManageAppointments,
    canCreatePayments,
    canManageAllTenants,
    canSelectPatientScope: false,
    isPatientSelfRole,
    tenantId,
    facilityId,
    patientId,
    isResolved,
  };
};

export default usePatientPortalAccess;