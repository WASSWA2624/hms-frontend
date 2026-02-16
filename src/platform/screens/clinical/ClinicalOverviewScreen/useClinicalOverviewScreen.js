/**
 * Shared logic for overview screens across Clinical + Tier 7 modules.
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useI18n, useNetwork, useClinicalAccess } from '@hooks';
import {
  BILLING_RESOURCE_LIST_ORDER,
  BIOMEDICAL_RESOURCE_LIST_ORDER,
  COMMUNICATIONS_RESOURCE_LIST_ORDER,
  COMPLIANCE_RESOURCE_LIST_ORDER,
  CLINICAL_RESOURCE_IDS,
  CLINICAL_RESOURCE_LIST_ORDER,
  EMERGENCY_RESOURCE_LIST_ORDER,
  HOUSEKEEPING_RESOURCE_LIST_ORDER,
  HR_RESOURCE_LIST_ORDER,
  INVENTORY_RESOURCE_LIST_ORDER,
  INTEGRATIONS_RESOURCE_LIST_ORDER,
  ICU_RESOURCE_LIST_ORDER,
  IPD_RESOURCE_LIST_ORDER,
  LAB_RESOURCE_LIST_ORDER,
  PHARMACY_RESOURCE_LIST_ORDER,
  RADIOLOGY_RESOURCE_LIST_ORDER,
  REPORTS_RESOURCE_LIST_ORDER,
  SUBSCRIPTIONS_RESOURCE_LIST_ORDER,
  THEATRE_RESOURCE_LIST_ORDER,
  getClinicalResourceConfig,
  sanitizeString,
  withClinicalContext,
} from '../ClinicalResourceConfigs';
import { resolveErrorMessage } from '../ClinicalScreenUtils';
import useClinicalResourceCrud from '../useClinicalResourceCrud';

const OVERVIEW_CONFIGS = {
  clinical: {
    i18nRoot: 'clinical',
    resourceIds: CLINICAL_RESOURCE_LIST_ORDER,
    primaryResourceId: CLINICAL_RESOURCE_IDS.ENCOUNTERS,
  },
  ipd: {
    i18nRoot: 'ipd',
    resourceIds: IPD_RESOURCE_LIST_ORDER,
    primaryResourceId: CLINICAL_RESOURCE_IDS.ADMISSIONS,
  },
  icu: {
    i18nRoot: 'icu',
    resourceIds: ICU_RESOURCE_LIST_ORDER,
    primaryResourceId: CLINICAL_RESOURCE_IDS.ICU_STAYS,
  },
  theatre: {
    i18nRoot: 'theatre',
    resourceIds: THEATRE_RESOURCE_LIST_ORDER,
    primaryResourceId: CLINICAL_RESOURCE_IDS.THEATRE_CASES,
  },
  emergency: {
    i18nRoot: 'emergency',
    resourceIds: EMERGENCY_RESOURCE_LIST_ORDER,
    primaryResourceId: CLINICAL_RESOURCE_IDS.EMERGENCY_CASES,
  },
  lab: {
    i18nRoot: 'lab',
    resourceIds: LAB_RESOURCE_LIST_ORDER,
    primaryResourceId: CLINICAL_RESOURCE_IDS.LAB_ORDERS,
  },
  radiology: {
    i18nRoot: 'radiology',
    resourceIds: RADIOLOGY_RESOURCE_LIST_ORDER,
    primaryResourceId: CLINICAL_RESOURCE_IDS.RADIOLOGY_ORDERS,
  },
  pharmacy: {
    i18nRoot: 'pharmacy',
    resourceIds: PHARMACY_RESOURCE_LIST_ORDER,
    primaryResourceId: CLINICAL_RESOURCE_IDS.PHARMACY_ORDERS,
  },
  inventory: {
    i18nRoot: 'inventory',
    resourceIds: INVENTORY_RESOURCE_LIST_ORDER,
    primaryResourceId: CLINICAL_RESOURCE_IDS.INVENTORY_ITEMS,
  },
  billing: {
    i18nRoot: 'billing',
    resourceIds: BILLING_RESOURCE_LIST_ORDER,
    primaryResourceId: CLINICAL_RESOURCE_IDS.INVOICES,
  },
  hr: {
    i18nRoot: 'hr',
    resourceIds: HR_RESOURCE_LIST_ORDER,
    primaryResourceId: CLINICAL_RESOURCE_IDS.STAFF_PROFILES,
  },
  housekeeping: {
    i18nRoot: 'housekeeping',
    resourceIds: HOUSEKEEPING_RESOURCE_LIST_ORDER,
    primaryResourceId: CLINICAL_RESOURCE_IDS.HOUSEKEEPING_TASKS,
  },
  biomedical: {
    i18nRoot: 'biomedical',
    resourceIds: BIOMEDICAL_RESOURCE_LIST_ORDER,
    primaryResourceId: CLINICAL_RESOURCE_IDS.EQUIPMENT_REGISTRIES,
  },
  reports: {
    i18nRoot: 'reports',
    resourceIds: REPORTS_RESOURCE_LIST_ORDER,
    primaryResourceId: CLINICAL_RESOURCE_IDS.DASHBOARD_WIDGETS,
    enableCreatePrimary: false,
    showRecentItems: false,
  },
  communications: {
    i18nRoot: 'communications',
    resourceIds: COMMUNICATIONS_RESOURCE_LIST_ORDER,
    primaryResourceId: CLINICAL_RESOURCE_IDS.NOTIFICATIONS,
    enableCreatePrimary: false,
    showRecentItems: false,
  },
  subscriptions: {
    i18nRoot: 'subscriptions',
    resourceIds: SUBSCRIPTIONS_RESOURCE_LIST_ORDER,
    primaryResourceId: CLINICAL_RESOURCE_IDS.SUBSCRIPTIONS,
    enableCreatePrimary: false,
    showRecentItems: false,
  },
  integrations: {
    i18nRoot: 'integrations',
    resourceIds: INTEGRATIONS_RESOURCE_LIST_ORDER,
    primaryResourceId: CLINICAL_RESOURCE_IDS.INTEGRATIONS,
    enableCreatePrimary: false,
    showRecentItems: false,
  },
  compliance: {
    i18nRoot: 'compliance',
    resourceIds: COMPLIANCE_RESOURCE_LIST_ORDER,
    primaryResourceId: CLINICAL_RESOURCE_IDS.AUDIT_LOGS,
    enableCreatePrimary: false,
    showRecentItems: false,
  },
};

const resolveOverviewConfig = (scope) => OVERVIEW_CONFIGS[scope] || OVERVIEW_CONFIGS.clinical;

const buildPrimaryContext = (resourceId, item) => {
  if (!item || typeof item !== 'object') return {};

  if (resourceId === CLINICAL_RESOURCE_IDS.ENCOUNTERS) {
    return {
      tenantId: item.tenant_id,
      facilityId: item.facility_id,
      patientId: item.patient_id,
      providerUserId: item.provider_user_id,
      encounterId: item.id,
      encounterType: item.encounter_type,
      status: item.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ADMISSIONS) {
    return {
      tenantId: item.tenant_id,
      facilityId: item.facility_id,
      patientId: item.patient_id,
      encounterId: item.encounter_id,
      admissionId: item.id,
      status: item.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.ICU_STAYS) {
    return {
      admissionId: item.admission_id,
      icuStayId: item.id,
      startedAtFrom: item.started_at,
      endedAtTo: item.ended_at,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.THEATRE_CASES) {
    return {
      encounterId: item.encounter_id,
      theatreCaseId: item.id,
      status: item.status,
      scheduledFrom: item.scheduled_at,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.EMERGENCY_CASES) {
    return {
      tenantId: item.tenant_id,
      facilityId: item.facility_id,
      patientId: item.patient_id,
      emergencyCaseId: item.id,
      severity: item.severity,
      status: item.status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.LAB_ORDERS) {
    return {
      encounterId: item.encounter_id,
      patientId: item.patient_id,
      labOrderId: item.id,
      status: item.status,
      orderedAtFrom: item.ordered_at,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.RADIOLOGY_ORDERS) {
    return {
      encounterId: item.encounter_id,
      patientId: item.patient_id,
      radiologyOrderId: item.id,
      radiologyTestId: item.radiology_test_id,
      status: item.status,
      orderedAtFrom: item.ordered_at,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.PHARMACY_ORDERS) {
    return {
      encounterId: item.encounter_id,
      patientId: item.patient_id,
      pharmacyOrderId: item.id,
      status: item.status,
      orderedAtFrom: item.ordered_at,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.INVENTORY_ITEMS) {
    return {
      tenantId: item.tenant_id,
      inventoryItemId: item.id,
      category: item.category,
      unit: item.unit,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.INVOICES) {
    return {
      tenantId: item.tenant_id,
      facilityId: item.facility_id,
      patientId: item.patient_id,
      invoiceId: item.id,
      status: item.status,
      billingStatus: item.billing_status,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.STAFF_PROFILES) {
    return {
      tenantId: item.tenant_id,
      userId: item.user_id,
      staffProfileId: item.id,
      departmentId: item.department_id,
      staffNumber: item.staff_number,
    };
  }

  if (resourceId === CLINICAL_RESOURCE_IDS.HOUSEKEEPING_TASKS) {
    return {
      facilityId: item.facility_id,
      roomId: item.room_id,
      userId: item.assigned_to_staff_id,
      status: item.status,
    };
  }

  return {};
};

const useClinicalOverviewScreen = (scope = 'clinical') => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const {
    canAccessClinical,
    canCreateClinicalRecords,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  } = useClinicalAccess();

  const overviewConfig = useMemo(() => resolveOverviewConfig(scope), [scope]);
  const primaryConfig = useMemo(
    () => getClinicalResourceConfig(overviewConfig.primaryResourceId),
    [overviewConfig.primaryResourceId]
  );
  const { list, data, isLoading, errorCode, reset } = useClinicalResourceCrud(
    overviewConfig.primaryResourceId
  );

  const normalizedTenantId = useMemo(() => sanitizeString(tenantId), [tenantId]);
  const normalizedFacilityId = useMemo(() => sanitizeString(facilityId), [facilityId]);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);
  const showRecentItems = overviewConfig.showRecentItems !== false;
  const canCreatePrimary =
    canCreateClinicalRecords &&
    overviewConfig.enableCreatePrimary !== false &&
    primaryConfig?.allowCreate !== false;

  const primaryItems = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  }, [data]);

  const recentItems = useMemo(
    () => (showRecentItems ? primaryItems.slice(0, 5) : []),
    [primaryItems, showRecentItems]
  );

  const cards = useMemo(
    () =>
      overviewConfig.resourceIds.map((resourceId) => {
        const config = getClinicalResourceConfig(resourceId);
        const pluralLabelKey = `${config?.i18nKey}.pluralLabel`;
        const descriptionKey = `${config?.i18nKey}.overviewDescription`;
        const translatedLabel = t(pluralLabelKey);
        const translatedDescription = t(descriptionKey);
        const fallbackLabel = config?.pluralLabelFallback || config?.labelFallback || resourceId;
        return {
          id: resourceId,
          routePath: config?.routePath || '/clinical',
          label: translatedLabel === pluralLabelKey ? fallbackLabel : translatedLabel,
          description:
            translatedDescription === descriptionKey
              ? fallbackLabel
              : translatedDescription,
        };
      }),
    [overviewConfig.resourceIds, t]
  );

  const i18nRoot = overviewConfig.i18nRoot;
  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, `${i18nRoot}.overview.loadError`),
    [t, errorCode, i18nRoot]
  );

  const loadPrimary = useCallback(() => {
    if (!isResolved || !canAccessClinical || !hasScope || !primaryConfig) return;
    const params = { ...(primaryConfig.listParams || { page: 1, limit: 20 }) };

    if (primaryConfig.requiresTenant && !canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }
    if (primaryConfig.supportsFacility && !canManageAllTenants && normalizedFacilityId) {
      params.facility_id = normalizedFacilityId;
    }

    reset();
    list(params);
  }, [
    isResolved,
    canAccessClinical,
    hasScope,
    primaryConfig,
    canManageAllTenants,
    normalizedTenantId,
    normalizedFacilityId,
    reset,
    list,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessClinical || !hasScope) {
      router.replace('/dashboard');
    }
  }, [isResolved, canAccessClinical, hasScope, router]);

  useEffect(() => {
    loadPrimary();
  }, [loadPrimary]);

  const handleRetry = useCallback(() => {
    loadPrimary();
  }, [loadPrimary]);

  const handleOpenResource = useCallback(
    (routePath) => {
      router.push(routePath);
    },
    [router]
  );

  const handleOpenRecentItem = useCallback(
    (item) => {
      const id = sanitizeString(item?.id);
      if (!id || !primaryConfig) return;
      const context = buildPrimaryContext(overviewConfig.primaryResourceId, item);
      router.push(withClinicalContext(`${primaryConfig.routePath}/${id}`, context));
    },
    [router, primaryConfig, overviewConfig.primaryResourceId]
  );

  const handleCreatePrimary = useCallback(() => {
    if (!canCreatePrimary || !primaryConfig) return;
    const context = {
      tenantId: normalizedTenantId || undefined,
      facilityId: normalizedFacilityId || undefined,
    };
    router.push(withClinicalContext(`${primaryConfig.routePath}/create`, context));
  }, [canCreatePrimary, primaryConfig, normalizedTenantId, normalizedFacilityId, router]);

  return {
    i18nRoot,
    cards,
    recentItems,
    canCreatePrimary,
    showRecentItems,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onOpenResource: handleOpenResource,
    onOpenRecentItem: handleOpenRecentItem,
    onCreatePrimary: handleCreatePrimary,
  };
};

export default useClinicalOverviewScreen;
