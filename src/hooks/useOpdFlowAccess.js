/**
 * useOpdFlowAccess Hook
 * Action-level OPD flow access policy with tenant/facility context.
 */
import { useMemo } from 'react';
import { OPD_ACCESS_POLICY, SCOPE_KEYS } from '@config/accessPolicy';
import useScopeAccess from './useScopeAccess';

const hasAnyRole = (assignedRoles, requiredRoles) =>
  requiredRoles.some((roleKey) => assignedRoles.includes(roleKey));

const useOpdFlowAccess = () => {
  const {
    roles,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  } = useScopeAccess(SCOPE_KEYS.SCHEDULING);

  const canAccessOpdFlow = useMemo(
    () => canManageAllTenants || hasAnyRole(roles, OPD_ACCESS_POLICY.view),
    [canManageAllTenants, roles]
  );
  const canStartFlow = useMemo(
    () => canManageAllTenants || hasAnyRole(roles, OPD_ACCESS_POLICY.start),
    [canManageAllTenants, roles]
  );

  const canPayConsultation = useMemo(
    () => canManageAllTenants || hasAnyRole(roles, OPD_ACCESS_POLICY.payConsultation),
    [canManageAllTenants, roles]
  );
  const canRecordVitals = useMemo(
    () => canManageAllTenants || hasAnyRole(roles, OPD_ACCESS_POLICY.recordVitals),
    [canManageAllTenants, roles]
  );
  const canAssignDoctor = useMemo(
    () => canManageAllTenants || hasAnyRole(roles, OPD_ACCESS_POLICY.assignDoctor),
    [canManageAllTenants, roles]
  );
  const canDoctorReview = useMemo(
    () => canManageAllTenants || hasAnyRole(roles, OPD_ACCESS_POLICY.doctorReview),
    [canManageAllTenants, roles]
  );
  const canCorrectStage = useMemo(
    () => canManageAllTenants || hasAnyRole(roles, OPD_ACCESS_POLICY.correctStage),
    [canManageAllTenants, roles]
  );

  return {
    canAccessOpdFlow,
    canStartFlow,
    canPayConsultation,
    canRecordVitals,
    canAssignDoctor,
    canDoctorReview,
    canCorrectStage,
    canDisposition:
      canManageAllTenants || hasAnyRole(roles, OPD_ACCESS_POLICY.disposition),
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  };
};

export default useOpdFlowAccess;
