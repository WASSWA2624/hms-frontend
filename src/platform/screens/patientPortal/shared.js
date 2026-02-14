import { useCallback, useEffect, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePatientPortalAccess } from '@hooks';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const APPOINTMENT_STATUS_VALUES = [
  'SCHEDULED',
  'CONFIRMED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
];

const RESULT_STATUS_VALUES = ['NORMAL', 'ABNORMAL', 'CRITICAL', 'PENDING', 'DRAFT', 'FINAL', 'AMENDED'];
const PHARMACY_ORDER_STATUS_VALUES = ['ORDERED', 'DISPENSED', 'PARTIALLY_DISPENSED', 'CANCELLED'];
const INVOICE_STATUS_VALUES = ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'];
const INVOICE_BILLING_STATUS_VALUES = ['DRAFT', 'ISSUED', 'PAID', 'PARTIAL', 'CANCELLED'];
const PAYMENT_STATUS_VALUES = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];
const PAYMENT_METHOD_VALUES = [
  'CASH',
  'CREDIT_CARD',
  'DEBIT_CARD',
  'PREPAID_CARD',
  'GIFT_CARD',
  'VOUCHER',
  'BANK_CHECK',
  'MOBILE_MONEY',
  'BANK_TRANSFER',
  'INSURANCE',
  'OTHER',
];
const CLAIM_STATUS_VALUES = ['SUBMITTED', 'APPROVED', 'REJECTED', 'PAID', 'CANCELLED'];

const getSearchParam = (params, keys = []) => {
  for (const key of keys) {
    const rawValue = params?.[key];
    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    if (value != null) {
      const normalized = String(value).trim();
      if (normalized) {
        return normalized;
      }
    }
  }
  return null;
};

const normalizeUuid = (value) => {
  if (value == null) return null;
  const normalized = String(value).trim();
  if (!normalized) return null;
  return UUID_REGEX.test(normalized) ? normalized : null;
};

const buildScopedPath = (path, scope = {}) => {
  const basePath = String(path || '').trim() || '/portal';
  const queryParts = [];

  const pushScopedParam = (key, value) => {
    const normalized = normalizeUuid(value);
    if (!normalized) return;
    queryParts.push(`${key}=${encodeURIComponent(normalized)}`);
  };

  pushScopedParam('patient_id', scope.patientId);
  pushScopedParam('tenant_id', scope.tenantId);
  pushScopedParam('facility_id', scope.facilityId);

  if (queryParts.length === 0) return basePath;
  return `${basePath}?${queryParts.join('&')}`;
};

const normalizeList = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const toIsoDateTime = (value) => {
  const normalized = String(value || '').trim();
  if (!normalized) return null;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
};

const toDateTimeInputValue = (value) => {
  const normalized = String(value || '').trim();
  if (!normalized) return '';
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return '';
  const pad = (part) => String(part).padStart(2, '0');
  const yyyy = parsed.getFullYear();
  const mm = pad(parsed.getMonth() + 1);
  const dd = pad(parsed.getDate());
  const hh = pad(parsed.getHours());
  const min = pad(parsed.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

const toPositiveDecimal = (value) => {
  const normalized = String(value || '').trim();
  if (!normalized) return null;
  if (!/^\d+(\.\d+)?$/.test(normalized)) return null;
  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return normalized;
};

const resolveTranslatedValue = (t, key, fallback) => {
  const translated = t(key);
  return translated === key ? fallback : translated;
};

const resolveEnumLabel = (t, keyPrefix, value) => {
  const normalized = String(value || '').trim().toUpperCase();
  if (!normalized) return '';
  return resolveTranslatedValue(t, `${keyPrefix}.${normalized}`, normalized);
};

const usePatientPortalScope = () => {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const access = usePatientPortalAccess();

  const requestedPatientId = useMemo(
    () => normalizeUuid(getSearchParam(searchParams, ['patient_id', 'patientId'])),
    [searchParams]
  );
  const requestedTenantId = useMemo(
    () => normalizeUuid(getSearchParam(searchParams, ['tenant_id', 'tenantId'])),
    [searchParams]
  );
  const requestedFacilityId = useMemo(
    () => normalizeUuid(getSearchParam(searchParams, ['facility_id', 'facilityId'])),
    [searchParams]
  );
  const accessPatientId = useMemo(() => normalizeUuid(access.patientId), [access.patientId]);
  const accessTenantId = useMemo(() => normalizeUuid(access.tenantId), [access.tenantId]);
  const accessFacilityId = useMemo(() => normalizeUuid(access.facilityId), [access.facilityId]);

  const isScopeMismatch = useMemo(() => {
    if (access.canSelectPatientScope) return false;
    if (!requestedPatientId) return false;
    if (!accessPatientId) return true;
    return requestedPatientId !== accessPatientId;
  }, [access.canSelectPatientScope, accessPatientId, requestedPatientId]);

  const effectivePatientId = useMemo(() => {
    if (access.canSelectPatientScope) return requestedPatientId || accessPatientId;
    return accessPatientId;
  }, [access.canSelectPatientScope, accessPatientId, requestedPatientId]);

  const effectiveTenantId = useMemo(() => {
    if (access.canManageAllTenants) return requestedTenantId || accessTenantId;
    return accessTenantId;
  }, [access.canManageAllTenants, accessTenantId, requestedTenantId]);

  const effectiveFacilityId = useMemo(() => {
    if (access.canManageAllTenants) return requestedFacilityId || accessFacilityId;
    return accessFacilityId;
  }, [access.canManageAllTenants, accessFacilityId, requestedFacilityId]);

  const hasPatientScope = Boolean(effectivePatientId);
  const hasTenantScope = access.canManageAllTenants || Boolean(effectiveTenantId);

  const canAccessRoute = Boolean(
    access.canAccessPatientPortal && hasPatientScope && hasTenantScope && !isScopeMismatch
  );

  const toScopedPath = useCallback(
    (path) =>
      buildScopedPath(path, {
        patientId: effectivePatientId,
        tenantId: effectiveTenantId,
        facilityId: effectiveFacilityId,
      }),
    [effectiveFacilityId, effectivePatientId, effectiveTenantId]
  );

  useEffect(() => {
    if (!access.isResolved) return;
    if (canAccessRoute) return;
    if (!access.canAccessPatientPortal) {
      router.replace('/dashboard');
      return;
    }
    if (hasPatientScope && hasTenantScope) {
      router.replace(toScopedPath('/portal'));
      return;
    }
    router.replace('/dashboard');
  }, [
    access.canAccessPatientPortal,
    access.isResolved,
    canAccessRoute,
    hasPatientScope,
    hasTenantScope,
    router,
    toScopedPath,
  ]);

  return {
    ...access,
    effectivePatientId,
    effectiveTenantId,
    effectiveFacilityId,
    hasPatientScope,
    hasTenantScope,
    isScopeMismatch,
    canAccessRoute,
    toScopedPath,
    isScopeReady: access.isResolved && canAccessRoute,
  };
};

export {
  APPOINTMENT_STATUS_VALUES,
  RESULT_STATUS_VALUES,
  PHARMACY_ORDER_STATUS_VALUES,
  INVOICE_STATUS_VALUES,
  INVOICE_BILLING_STATUS_VALUES,
  PAYMENT_STATUS_VALUES,
  PAYMENT_METHOD_VALUES,
  CLAIM_STATUS_VALUES,
  buildScopedPath,
  normalizeUuid,
  normalizeList,
  toIsoDateTime,
  toDateTimeInputValue,
  toPositiveDecimal,
  resolveEnumLabel,
  usePatientPortalScope,
};
