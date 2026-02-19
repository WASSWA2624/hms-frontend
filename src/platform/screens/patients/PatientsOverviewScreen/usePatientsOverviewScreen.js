/**
 * Shared logic for PatientsOverviewScreen.
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useI18n, useNetwork, usePatient, usePatientAccess } from '@hooks';
import {
  getPatientResourceConfig,
  PATIENT_RESOURCE_LIST_ORDER,
  sanitizeString,
  withPatientContext,
} from '../patientResourceConfigs';
import { resolveErrorMessage } from '../patientScreenUtils';

const DEFAULT_OVERVIEW_PAGE = 1;
const DEFAULT_OVERVIEW_LIMIT = 20;
const MAX_OVERVIEW_LIMIT = 100;

const normalizeBoundedLimit = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return DEFAULT_OVERVIEW_LIMIT;
  return Math.min(MAX_OVERVIEW_LIMIT, Math.max(1, Math.trunc(numeric)));
};

const toTimestamp = (value) => {
  const normalized = sanitizeString(value);
  if (!normalized) return 0;
  const parsed = Date.parse(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const resolvePatientDisplayName = (patient, fallbackLabel) => {
  const fullName = `${sanitizeString(patient?.first_name)} ${sanitizeString(patient?.last_name)}`.trim();
  if (fullName) return fullName;

  const readableBusinessId = [
    patient?.patient_code,
    patient?.patient_number,
    patient?.medical_record_number,
    patient?.mrn,
    patient?.identifier_value,
  ]
    .map((value) => sanitizeString(value))
    .find(Boolean);

  return readableBusinessId || fallbackLabel;
};

const resolvePatientSubtitle = (patient, fallbackLabel) => {
  const gender = sanitizeString(patient?.gender);
  const dateOfBirth = sanitizeString(patient?.date_of_birth);
  if (gender && dateOfBirth) return `${gender} - ${dateOfBirth}`;
  if (gender) return gender;
  if (dateOfBirth) return dateOfBirth;
  return fallbackLabel;
};

const compareRecentPatients = (left, right) => {
  const updatedAtDiff = toTimestamp(right?.updated_at) - toTimestamp(left?.updated_at);
  if (updatedAtDiff !== 0) return updatedAtDiff;

  const createdAtDiff = toTimestamp(right?.created_at) - toTimestamp(left?.created_at);
  if (createdAtDiff !== 0) return createdAtDiff;

  const leftName = `${sanitizeString(left?.last_name)} ${sanitizeString(left?.first_name)}`.trim();
  const rightName = `${sanitizeString(right?.last_name)} ${sanitizeString(right?.first_name)}`.trim();
  const nameDiff = leftName.localeCompare(rightName);
  if (nameDiff !== 0) return nameDiff;

  const leftCode = sanitizeString(left?.patient_code || left?.medical_record_number || left?.mrn);
  const rightCode = sanitizeString(right?.patient_code || right?.medical_record_number || right?.mrn);
  return leftCode.localeCompare(rightCode);
};

const usePatientsOverviewScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const {
    canAccessPatients,
    canCreatePatientRecords,
    canManageAllTenants,
    tenantId,
    isResolved,
  } = usePatientAccess();

  const { list, data, isLoading, errorCode, reset } = usePatient();

  const normalizedTenantId = useMemo(() => sanitizeString(tenantId), [tenantId]);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);
  const canViewOverview = isResolved && canAccessPatients && hasScope;

  const patientItems = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  }, [data]);

  const recentPatients = useMemo(
    () =>
      [...patientItems]
        .sort(compareRecentPatients)
        .slice(0, 5)
        .map((patient, index) => {
          const fallbackName = t('patients.overview.unnamedPatient', {
            position: index + 1,
          });
          return {
            ...patient,
            displayName: resolvePatientDisplayName(patient, fallbackName),
            subtitle: resolvePatientSubtitle(patient, t('patients.overview.unknownDemographics')),
            listKey: sanitizeString(patient?.id) || `recent-patient-${index + 1}`,
          };
        }),
    [patientItems, t]
  );

  const cards = useMemo(
    () =>
      PATIENT_RESOURCE_LIST_ORDER.map((resourceId) => {
        const config = getPatientResourceConfig(resourceId);
        return {
          id: resourceId,
          routePath: config?.routePath || '/patients',
          label: t(`${config?.i18nKey}.pluralLabel`),
          description: t(`${config?.i18nKey}.overviewDescription`),
        };
      }),
    [t]
  );

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'patients.overview.loadError'),
    [t, errorCode]
  );

  const overviewSummary = useMemo(
    () => ({
      scope: canManageAllTenants
        ? t('patients.overview.scopeSummaryAllTenants')
        : t('patients.overview.scopeSummaryTenant'),
      access: canCreatePatientRecords
        ? t('patients.overview.accessSummaryReadWrite')
        : t('patients.overview.accessSummaryReadOnly'),
      recentCount: t('patients.overview.recentPatientsCount', { count: recentPatients.length }),
    }),
    [canManageAllTenants, canCreatePatientRecords, recentPatients.length, t]
  );

  const helpContent = useMemo(
    () => ({
      label: t('patients.overview.helpLabel'),
      tooltip: t('patients.overview.helpTooltip'),
      title: t('patients.overview.helpTitle'),
      body: t('patients.overview.helpBody'),
      items: [
        t('patients.overview.helpItems.scope'),
        t('patients.overview.helpItems.sequence'),
        t('patients.overview.helpItems.access'),
        t('patients.overview.helpItems.recovery'),
      ],
    }),
    [t]
  );

  const loadPatients = useCallback(() => {
    if (!canViewOverview) return;
    const params = {
      page: DEFAULT_OVERVIEW_PAGE,
      limit: normalizeBoundedLimit(DEFAULT_OVERVIEW_LIMIT),
    };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }
    reset();
    list(params);
  }, [
    canViewOverview,
    canManageAllTenants,
    normalizedTenantId,
    reset,
    list,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessPatients || !hasScope) {
      router.replace('/dashboard');
    }
  }, [isResolved, canAccessPatients, hasScope, router]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const handleRetry = useCallback(() => {
    loadPatients();
  }, [loadPatients]);

  const handleOpenResource = useCallback(
    (routePath) => {
      if (!canViewOverview) return;
      router.push(routePath);
    },
    [canViewOverview, router]
  );

  const handleOpenPatient = useCallback(
    (patientId) => {
      if (!canViewOverview) return;
      const safeId = sanitizeString(patientId);
      if (!safeId) return;
      router.push(withPatientContext(`/patients/patients/${safeId}`, safeId));
    },
    [canViewOverview, router]
  );

  const handleRegisterPatient = useCallback(() => {
    if (!canViewOverview || !canCreatePatientRecords) return;
    router.push('/patients/patients/create');
  }, [canViewOverview, canCreatePatientRecords, router]);

  return {
    cards,
    overviewSummary,
    helpContent,
    recentPatients,
    canCreatePatientRecords,
    showRegisterPatientAction: canViewOverview && canCreatePatientRecords,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onOpenResource: handleOpenResource,
    onOpenPatient: handleOpenPatient,
    onRegisterPatient: handleRegisterPatient,
  };
};

export default usePatientsOverviewScreen;
