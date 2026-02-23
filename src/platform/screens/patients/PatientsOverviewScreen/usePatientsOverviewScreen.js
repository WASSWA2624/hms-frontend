/**
 * Shared logic for PatientsOverviewScreen.
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useI18n, useNetwork, usePatient, usePatientAccess } from '@hooks';
import { confirmAction } from '@utils';
import {
  sanitizeString,
} from '../patientResourceConfigs';
import { resolveErrorMessage } from '../patientScreenUtils';

const DEFAULT_OVERVIEW_PAGE = 1;
const DEFAULT_OVERVIEW_LIMIT = 20;
const MAX_OVERVIEW_LIMIT = 100;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const sanitizePrimitiveValue = (value) => {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value).trim();
  return '';
};

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

const resolveContextLabel = (context, fallback) => {
  const label = sanitizeString(context?.label || context?.name);
  const contextId = sanitizeString(context?.id);
  const friendlyId = sanitizeString(
    context?.human_friendly_id
    || context?.humanFriendlyId
    || (contextId && !UUID_PATTERN.test(contextId) ? contextId : '')
  );
  if (label && friendlyId) return `${label} (${friendlyId})`;
  return label || friendlyId || fallback;
};

const composeContextLabel = (label, humanFriendlyId, fallback) => {
  const normalizedLabel = sanitizeString(label);
  const normalizedHumanFriendlyId = sanitizeString(humanFriendlyId);
  if (normalizedLabel && normalizedHumanFriendlyId) return `${normalizedLabel} (${normalizedHumanFriendlyId})`;
  return normalizedLabel || normalizedHumanFriendlyId || fallback;
};

const resolveContactEntryValue = (entry) => {
  if (entry == null) return '';
  if (typeof entry === 'string' || typeof entry === 'number') {
    return sanitizePrimitiveValue(entry);
  }

  return [
    entry?.value,
    entry?.contact_value,
    entry?.contact,
    entry?.phone,
    entry?.phone_number,
    entry?.mobile,
    entry?.mobile_number,
    entry?.telephone,
    entry?.tel,
    entry?.email,
    entry?.email_address,
  ]
    .map((value) => sanitizePrimitiveValue(value))
    .find(Boolean) || '';
};

const resolvePatientContactLabel = (patient, fallback = '') => {
  const directContactValue = [
    patient?.contact,
    patient?.contact_label,
    patient?.contact_value,
    patient?.primary_contact,
    patient?.phone,
    patient?.phone_number,
    patient?.mobile,
    patient?.mobile_number,
    patient?.telephone,
    patient?.tel,
    patient?.email,
    patient?.email_address,
    patient?.primary_phone,
    patient?.primary_phone_number,
  ]
    .map((value) => sanitizePrimitiveValue(value))
    .find(Boolean);
  if (directContactValue) return directContactValue;

  const nestedContactValue = [
    patient?.primary_contact_details,
    patient?.primary_contact_detail,
    patient?.primaryContact,
    patient?.contact,
  ]
    .map((entry) => resolveContactEntryValue(entry))
    .find(Boolean);
  if (nestedContactValue) return nestedContactValue;

  const contactCollections = [
    patient?.contacts,
    patient?.patient_contacts,
    patient?.contact_entries,
    patient?.contact_list,
  ];

  for (let index = 0; index < contactCollections.length; index += 1) {
    const collection = contactCollections[index];
    if (!Array.isArray(collection) || collection.length === 0) continue;
    const value = collection
      .map((entry) => resolveContactEntryValue(entry))
      .find(Boolean);
    if (value) return value;
  }

  return fallback;
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
    tenantName,
    tenantHumanFriendlyId,
    facilityId,
    facilityName,
    facilityHumanFriendlyId,
    isResolved,
  } = usePatientAccess();

  const { list, data, isLoading, errorCode, reset, remove } = usePatient();

  const normalizedTenantId = useMemo(() => sanitizeString(tenantId), [tenantId]);
  const normalizedFacilityId = useMemo(() => sanitizeString(facilityId), [facilityId]);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);
  const canViewOverview = isResolved && canAccessPatients && hasScope;
  const scopedTenantFallbackLabel = useMemo(
    () => composeContextLabel(tenantName, tenantHumanFriendlyId, t('patients.directory.unassignedTenant')),
    [tenantHumanFriendlyId, tenantName, t]
  );
  const scopedFacilityFallbackLabel = useMemo(
    () => composeContextLabel(facilityName, facilityHumanFriendlyId, t('patients.directory.unassignedFacility')),
    [facilityHumanFriendlyId, facilityName, t]
  );

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
            humanFriendlyId: sanitizeString(patient?.human_friendly_id) || '-',
            tenantLabel: resolveContextLabel(
              patient?.tenant_context || {
                label: patient?.tenant_label,
                human_friendly_id: patient?.tenant_human_friendly_id,
              },
              scopedTenantFallbackLabel
            ),
            facilityLabel: resolveContextLabel(
              patient?.facility_context || {
                label: patient?.facility_label,
                human_friendly_id: patient?.facility_human_friendly_id,
              },
              scopedFacilityFallbackLabel
            ),
            contactLabel: resolvePatientContactLabel(patient, ''),
            listKey: sanitizeString(patient?.id) || `recent-patient-${index + 1}`,
          };
        }),
    [patientItems, scopedFacilityFallbackLabel, scopedTenantFallbackLabel, t]
  );

  const cards = useMemo(
    () => [
      {
        id: 'directory',
        routePath: '/patients/patients',
        label: t('patients.overview.quickPaths.directoryTitle'),
        description: t('patients.overview.quickPaths.directoryDescription'),
      },
      {
        id: 'legal',
        routePath: '/patients/legal',
        label: t('patients.overview.quickPaths.legalTitle'),
        description: t('patients.overview.quickPaths.legalDescription'),
      },
    ],
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
        : normalizedFacilityId
          ? t('patients.overview.scopeSummaryFacility')
        : t('patients.overview.scopeSummaryTenant'),
      access: canCreatePatientRecords
        ? t('patients.overview.accessSummaryReadWrite')
        : t('patients.overview.accessSummaryReadOnly'),
      recentCount: t('patients.overview.recentPatientsCount', { count: recentPatients.length }),
    }),
    [canManageAllTenants, normalizedFacilityId, canCreatePatientRecords, recentPatients.length, t]
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
      if (normalizedFacilityId) {
        params.facility_id = normalizedFacilityId;
      }
    }
    reset();
    list(params);
  }, [
    canViewOverview,
    canManageAllTenants,
    normalizedTenantId,
    normalizedFacilityId,
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
      router.push(`/patients/patients/${safeId}`);
    },
    [canViewOverview, router]
  );

  const handleEditPatient = useCallback(
    (patientId) => {
      if (!canViewOverview || !canCreatePatientRecords) return;
      const safeId = sanitizeString(patientId);
      if (!safeId) return;
      router.push(`/patients/patients/${safeId}/edit`);
    },
    [canCreatePatientRecords, canViewOverview, router]
  );

  const handleDeletePatient = useCallback(
    async (patientId) => {
      if (!canViewOverview || !canCreatePatientRecords) return;
      const safeId = sanitizeString(patientId);
      if (!safeId) return;
      if (!confirmAction(t('common.confirmDelete'))) return;

      const result = await remove(safeId);
      if (result === undefined) return;
      loadPatients();
    },
    [canCreatePatientRecords, canViewOverview, loadPatients, remove, t]
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
    onEditPatient: handleEditPatient,
    onDeletePatient: handleDeletePatient,
    onRegisterPatient: handleRegisterPatient,
  };
};

export default usePatientsOverviewScreen;
