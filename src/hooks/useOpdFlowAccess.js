/**
 * useOpdFlowAccess Hook
 * Action-level OPD flow access policy with tenant/facility context.
 */
import { useMemo } from 'react';
import { ROLE_KEYS, SCOPE_KEYS } from '@config/accessPolicy';
import useScopeAccess from './useScopeAccess';

const OPD_PAY_ROLES = [
  ROLE_KEYS.SUPER_ADMIN,
  ROLE_KEYS.TENANT_ADMIN,
  ROLE_KEYS.FACILITY_ADMIN,
  ROLE_KEYS.RECEPTIONIST,
  ROLE_KEYS.BILLING,
];

const OPD_VITALS_ROLES = [
  ROLE_KEYS.SUPER_ADMIN,
  ROLE_KEYS.TENANT_ADMIN,
  ROLE_KEYS.FACILITY_ADMIN,
  ROLE_KEYS.DOCTOR,
  ROLE_KEYS.NURSE,
];

const OPD_ASSIGN_ROLES = [
  ROLE_KEYS.SUPER_ADMIN,
  ROLE_KEYS.TENANT_ADMIN,
  ROLE_KEYS.FACILITY_ADMIN,
  ROLE_KEYS.RECEPTIONIST,
  ROLE_KEYS.NURSE,
];

const OPD_REVIEW_AND_DISPOSITION_ROLES = [
  ROLE_KEYS.SUPER_ADMIN,
  ROLE_KEYS.TENANT_ADMIN,
  ROLE_KEYS.FACILITY_ADMIN,
  ROLE_KEYS.DOCTOR,
];

const hasAnyRole = (assignedRoles, requiredRoles) =>
  requiredRoles.some((roleKey) => assignedRoles.includes(roleKey));

const useOpdFlowAccess = () => {
  const {
    roles,
    canRead,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  } = useScopeAccess(SCOPE_KEYS.SCHEDULING);

  const canAccessOpdFlow = canRead;
  const canStartFlow = canAccessOpdFlow;

  const canPayConsultation = useMemo(
    () => canManageAllTenants || hasAnyRole(roles, OPD_PAY_ROLES),
    [canManageAllTenants, roles]
  );
  const canRecordVitals = useMemo(
    () => canManageAllTenants || hasAnyRole(roles, OPD_VITALS_ROLES),
    [canManageAllTenants, roles]
  );
  const canAssignDoctor = useMemo(
    () => canManageAllTenants || hasAnyRole(roles, OPD_ASSIGN_ROLES),
    [canManageAllTenants, roles]
  );
  const canDoctorReview = useMemo(
    () => canManageAllTenants || hasAnyRole(roles, OPD_REVIEW_AND_DISPOSITION_ROLES),
    [canManageAllTenants, roles]
  );

  return {
    canAccessOpdFlow,
    canStartFlow,
    canPayConsultation,
    canRecordVitals,
    canAssignDoctor,
    canDoctorReview,
    canDisposition: canDoctorReview,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  };
};

export default useOpdFlowAccess;