/**
 * useSchedulingAccess Hook
 * Centralized scheduling route/action access policy with tenant/facility context.
 */
import { SCOPE_KEYS } from '@config/accessPolicy';
import useScopeAccess from './useScopeAccess';

const useSchedulingAccess = () => {
  const {
    canRead,
    canWrite,
    canDelete,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  } = useScopeAccess(SCOPE_KEYS.SCHEDULING);

  const canAccessScheduling = canRead;
  const canManageSchedulingRecords = canWrite;
  const canDeleteSchedulingRecords = canDelete;

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