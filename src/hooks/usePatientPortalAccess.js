/**
 * usePatientPortalAccess Hook
 * Route and action access policy for patient-facing portal routes.
 */
import { useMemo } from 'react';
import useAuth from './useAuth';
import useResolvedRoles from './useResolvedRoles';
import { normalizeRoleKey } from './roleUtils';

const GLOBAL_ADMIN_ROLES = ['APP_ADMIN', 'SUPER_ADMIN'];
const PATIENT_SELF_ROLES = ['PATIENT', 'PATIENT_USER', 'PATIENT_PORTAL_USER'];
const PATIENT_PORTAL_READ_ROLES = [
  ...PATIENT_SELF_ROLES,
  'TENANT_ADMIN',
  'ADMIN',
  'DOCTOR',
  'NURSE',
  'CLINICAL_OFFICER',
  'FRONT_DESK',
  'RECEPTIONIST',
  'EMERGENCY_OFFICER',
  'FINANCE_MANAGER',
  'ACCOUNTANT',
  'BILLING_CLERK',
  'INSURANCE_OFFICER',
];
const PATIENT_PORTAL_APPOINTMENT_WRITE_ROLES = [
  ...PATIENT_SELF_ROLES,
  'TENANT_ADMIN',
  'ADMIN',
  'DOCTOR',
  'NURSE',
  'CLINICAL_OFFICER',
  'FRONT_DESK',
  'RECEPTIONIST',
];
const PATIENT_PORTAL_PAYMENT_WRITE_ROLES = [
  ...PATIENT_SELF_ROLES,
  'TENANT_ADMIN',
  'ADMIN',
  'FINANCE_MANAGER',
  'ACCOUNTANT',
  'BILLING_CLERK',
];
const PATIENT_SCOPE_SELECTION_ROLES = [
  'TENANT_ADMIN',
  'ADMIN',
  'DOCTOR',
  'NURSE',
  'CLINICAL_OFFICER',
  'FRONT_DESK',
  'RECEPTIONIST',
  'FINANCE_MANAGER',
  'ACCOUNTANT',
  'BILLING_CLERK',
  'INSURANCE_OFFICER',
];

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

const hasAnyRole = (roleSet, requiredRoles) => requiredRoles.some((role) => roleSet.has(role));

const usePatientPortalAccess = () => {
  const { user } = useAuth();
  const { roles, isResolved } = useResolvedRoles();

  const roleSet = useMemo(
    () => new Set((roles || []).map((role) => normalizeRoleKey(role)).filter(Boolean)),
    [roles]
  );

  const canManageAllTenants = hasAnyRole(roleSet, GLOBAL_ADMIN_ROLES);
  const isPatientSelfRole = hasAnyRole(roleSet, PATIENT_SELF_ROLES);

  const canAccessPatientPortal =
    canManageAllTenants || hasAnyRole(roleSet, PATIENT_PORTAL_READ_ROLES);
  const canManageAppointments =
    canManageAllTenants || hasAnyRole(roleSet, PATIENT_PORTAL_APPOINTMENT_WRITE_ROLES);
  const canCreatePayments =
    canManageAllTenants || hasAnyRole(roleSet, PATIENT_PORTAL_PAYMENT_WRITE_ROLES);
  const canSelectPatientScope =
    canManageAllTenants || hasAnyRole(roleSet, PATIENT_SCOPE_SELECTION_ROLES);

  const tenantId = resolveTenantId(user);
  const facilityId = resolveFacilityId(user);
  const patientId = resolvePatientId(user);

  return {
    canAccessPatientPortal,
    canManageAppointments,
    canCreatePayments,
    canManageAllTenants,
    canSelectPatientScope,
    isPatientSelfRole,
    tenantId,
    facilityId,
    patientId,
    isResolved,
  };
};

export default usePatientPortalAccess;
