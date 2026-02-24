/**
 * useClinicalAccess Hook
 * Centralized clinical route/action access policy with tenant/facility context.
 */
import { SCOPE_KEYS } from '@config/accessPolicy';
import useScopeAccess from './useScopeAccess';

const useClinicalAccess = () => {
  const {
    canRead,
    canWrite,
    canDelete,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  } = useScopeAccess(SCOPE_KEYS.CLINICAL);

  const canAccessClinical = canRead;
  const canManageClinicalRecords = canWrite;
  const canDeleteClinicalRecords = canDelete;

  return {
    canAccessClinical,
    canManageClinicalRecords,
    canCreateClinicalRecords: canManageClinicalRecords,
    canEditClinicalRecords: canManageClinicalRecords,
    canDeleteClinicalRecords,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  };
};

export default useClinicalAccess;