/**
 * useOpdFlowAccess Hook
 * Action-level OPD flow access policy with tenant/facility context.
 */
import { useMemo } from 'react';
import useAuth from './useAuth';
import useResolvedRoles from './useResolvedRoles';
import { normalizeRoleKey } from './roleUtils';

const GLOBAL_ADMIN_ROLES = ['APP_ADMIN', 'SUPER_ADMIN'];
const OPD_READ_ROLES = [
  'TENANT_ADMIN',
  'ADMIN',
  'DOCTOR',
  'NURSE',
  'CLINICAL_OFFICER',
  'FRONT_DESK',
  'RECEPTIONIST',
  'EMERGENCY_OFFICER',
];
const OPD_PAY_ROLES = ['TENANT_ADMIN', 'ADMIN', 'FRONT_DESK', 'RECEPTIONIST'];
const OPD_VITALS_ROLES = [
  'TENANT_ADMIN',
  'ADMIN',
  'DOCTOR',
  'NURSE',
  'CLINICAL_OFFICER',
  'EMERGENCY_OFFICER',
];
const OPD_ASSIGN_ROLES = [
  'TENANT_ADMIN',
  'ADMIN',
  'FRONT_DESK',
  'RECEPTIONIST',
  'NURSE',
  'CLINICAL_OFFICER',
];
const OPD_REVIEW_AND_DISPOSITION_ROLES = [
  'TENANT_ADMIN',
  'ADMIN',
  'DOCTOR',
  'CLINICAL_OFFICER',
  'EMERGENCY_OFFICER',
];

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

const useOpdFlowAccess = () => {
  const { user } = useAuth();
  const { roles, isResolved } = useResolvedRoles();

  const roleSet = useMemo(
    () => new Set((roles || []).map((role) => normalizeRoleKey(role)).filter(Boolean)),
    [roles]
  );

  const canManageAllTenants = hasAnyRole(roleSet, GLOBAL_ADMIN_ROLES);
  const canAccessOpdFlow = canManageAllTenants || hasAnyRole(roleSet, OPD_READ_ROLES);
  const canStartFlow = canAccessOpdFlow;
  const canPayConsultation = canManageAllTenants || hasAnyRole(roleSet, OPD_PAY_ROLES);
  const canRecordVitals = canManageAllTenants || hasAnyRole(roleSet, OPD_VITALS_ROLES);
  const canAssignDoctor = canManageAllTenants || hasAnyRole(roleSet, OPD_ASSIGN_ROLES);
  const canDoctorReview = canManageAllTenants || hasAnyRole(roleSet, OPD_REVIEW_AND_DISPOSITION_ROLES);
  const canDisposition = canDoctorReview;
  const tenantId = resolveTenantId(user);
  const facilityId = resolveFacilityId(user);

  return {
    canAccessOpdFlow,
    canStartFlow,
    canPayConsultation,
    canRecordVitals,
    canAssignDoctor,
    canDoctorReview,
    canDisposition,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  };
};

export default useOpdFlowAccess;
