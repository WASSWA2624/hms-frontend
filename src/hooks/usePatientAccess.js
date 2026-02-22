/**
 * usePatientAccess Hook
 * Centralized patient route/action access policy with tenant/facility context.
 */
import { useMemo } from 'react';
import useAuth from './useAuth';
import useResolvedRoles from './useResolvedRoles';
import { normalizeRoleKey } from './roleUtils';

const GLOBAL_ADMIN_ROLES = ['APP_ADMIN', 'SUPER_ADMIN'];
const PATIENT_ACCESS_ROLES = [
  'TENANT_ADMIN',
  'ADMIN',
  'DOCTOR',
  'NURSE',
  'CLINICAL_OFFICER',
  'FRONT_DESK',
  'RECEPTIONIST',
  'EMERGENCY_OFFICER',
];
const PATIENT_WRITE_ROLES = [
  'TENANT_ADMIN',
  'ADMIN',
  'DOCTOR',
  'NURSE',
  'CLINICAL_OFFICER',
  'FRONT_DESK',
  'RECEPTIONIST',
];
const PATIENT_DELETE_ROLES = ['TENANT_ADMIN', 'ADMIN'];
const PATIENT_READ_PERMISSION = 'patient:read';
const PATIENT_WRITE_PERMISSION = 'patient:write';
const PATIENT_DELETE_PERMISSION = 'patient:delete';
const LEGAL_MODULE_SLUGS = new Set(['consent', 'terms-acceptance', 'terms-acceptances']);

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

const toNormalizedString = (value) => String(value || '').trim().toLowerCase();

const normalizeModuleSlug = (value) => {
  const normalized = toNormalizedString(value);
  if (!normalized) return '';
  if (normalized.endsWith('ies')) return `${normalized.slice(0, -3)}y`;
  if (normalized.endsWith('sses')) return normalized.slice(0, -2);
  if (normalized.endsWith('s')) return normalized.slice(0, -1);
  return normalized;
};

const resolvePermissionSet = (user) => {
  const values = [];

  const appendValues = (candidate) => {
    if (!candidate) return;
    if (Array.isArray(candidate)) {
      candidate.forEach((entry) => {
        if (!entry) return;
        if (typeof entry === 'string') {
          values.push(entry);
          return;
        }
        values.push(
          entry.name,
          entry.code,
          entry.key,
          entry.permission,
          entry.permission_name
        );
      });
      return;
    }
    if (typeof candidate === 'string') {
      values.push(candidate);
      return;
    }
    if (typeof candidate === 'object') {
      values.push(candidate.name, candidate.code, candidate.key, candidate.permission);
    }
  };

  appendValues(user?.permissions);
  appendValues(user?.permission_codes);
  appendValues(user?.permission_names);
  appendValues(user?.role_permissions);
  appendValues(user?.profile?.permissions);

  if (Array.isArray(user?.roles)) {
    user.roles.forEach((roleEntry) => {
      appendValues(roleEntry?.permissions);
      appendValues(roleEntry?.role?.permissions);
    });
  }

  return new Set(values.map(toNormalizedString).filter(Boolean));
};

const resolveEntitledModuleSet = (user) => {
  const entitlementCandidates = [
    user?.entitled_modules,
    user?.module_entitlements,
    user?.modules,
    user?.entitlements?.modules,
    user?.profile?.entitled_modules,
  ];

  const moduleEntries = entitlementCandidates.find((candidate) => Array.isArray(candidate));
  if (!Array.isArray(moduleEntries) || moduleEntries.length === 0) {
    return null;
  }

  const set = new Set();
  moduleEntries.forEach((entry) => {
    if (typeof entry === 'string') {
      const slug = normalizeModuleSlug(entry);
      if (slug) set.add(slug);
      return;
    }

    const isDenied = entry?.is_active === false || entry?.entitled === false || entry?.allowed === false;
    if (isDenied) return;

    const slug = normalizeModuleSlug(
      entry?.module_slug
      || entry?.module_name
      || entry?.name
      || entry?.slug
      || entry?.module
    );
    if (slug) set.add(slug);
  });

  return set.size > 0 ? set : null;
};

const usePatientAccess = () => {
  const { user } = useAuth();
  const { roles, isResolved } = useResolvedRoles();

  const roleSet = useMemo(
    () => new Set((roles || []).map((role) => normalizeRoleKey(role)).filter(Boolean)),
    [roles]
  );
  const permissionSet = useMemo(() => resolvePermissionSet(user), [user]);
  const entitledModules = useMemo(() => resolveEntitledModuleSet(user), [user]);

  const canManageAllTenants = hasAnyRole(roleSet, GLOBAL_ADMIN_ROLES);
  const hasReadPermission = permissionSet.has(PATIENT_READ_PERMISSION);
  const hasWritePermission = permissionSet.has(PATIENT_WRITE_PERMISSION);
  const hasDeletePermission = permissionSet.has(PATIENT_DELETE_PERMISSION);
  const canAccessPatients = canManageAllTenants || hasReadPermission || hasAnyRole(roleSet, PATIENT_ACCESS_ROLES);
  const canManagePatientRecords = canManageAllTenants || hasWritePermission || hasAnyRole(roleSet, PATIENT_WRITE_ROLES);
  const canDeletePatientRecords = canManageAllTenants || hasDeletePermission || hasAnyRole(roleSet, PATIENT_DELETE_ROLES);
  const canAccessPatientLegalHub = canAccessPatients && (
    !entitledModules
    || [...LEGAL_MODULE_SLUGS].some((slug) => entitledModules.has(slug))
  );
  const tenantId = resolveTenantId(user);
  const facilityId = resolveFacilityId(user);

  return {
    canAccessPatients,
    canAccessPatientLegalHub,
    canManagePatientRecords,
    canCreatePatientRecords: canManagePatientRecords,
    canEditPatientRecords: canManagePatientRecords,
    canDeletePatientRecords,
    hasReadPermission,
    hasWritePermission,
    hasDeletePermission,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  };
};

export default usePatientAccess;
