/**
 * Shared logic for ClinicalOverviewScreen.
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useEncounter, useI18n, useNetwork, useClinicalAccess } from '@hooks';
import {
  getClinicalResourceConfig,
  CLINICAL_RESOURCE_LIST_ORDER,
  sanitizeString,
  withClinicalContext,
} from '../ClinicalResourceConfigs';
import { resolveErrorMessage } from '../ClinicalScreenUtils';

const useClinicalOverviewScreen = () => {
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

  const { list, data, isLoading, errorCode, reset } = useEncounter();

  const normalizedTenantId = useMemo(() => sanitizeString(tenantId), [tenantId]);
  const normalizedFacilityId = useMemo(() => sanitizeString(facilityId), [facilityId]);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);

  const encounterItems = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  }, [data]);

  const recentEncounters = useMemo(() => encounterItems.slice(0, 5), [encounterItems]);

  const cards = useMemo(
    () =>
      CLINICAL_RESOURCE_LIST_ORDER.map((resourceId) => {
        const config = getClinicalResourceConfig(resourceId);
        return {
          id: resourceId,
          routePath: config?.routePath || '/clinical',
          label: t(`${config?.i18nKey}.pluralLabel`),
          description: t(`${config?.i18nKey}.overviewDescription`),
        };
      }),
    [t]
  );

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'clinical.overview.loadError'),
    [t, errorCode]
  );

  const loadEncounters = useCallback(() => {
    if (!isResolved || !canAccessClinical || !hasScope) return;
    const params = { page: 1, limit: 20 };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
      if (normalizedFacilityId) {
        params.facility_id = normalizedFacilityId;
      }
    }
    reset();
    list(params);
  }, [
    isResolved,
    canAccessClinical,
    hasScope,
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
    loadEncounters();
  }, [loadEncounters]);

  const handleRetry = useCallback(() => {
    loadEncounters();
  }, [loadEncounters]);

  const handleOpenResource = useCallback(
    (routePath) => {
      router.push(routePath);
    },
    [router]
  );

  const handleOpenEncounter = useCallback(
    (encounter) => {
      const encounterId = sanitizeString(encounter?.id);
      if (!encounterId) return;
      const path = withClinicalContext(
        `/clinical/encounters/${encounterId}`,
        {
          tenantId: encounter?.tenant_id,
          facilityId: encounter?.facility_id,
          patientId: encounter?.patient_id,
          providerUserId: encounter?.provider_user_id,
          encounterId,
          encounterType: encounter?.encounter_type,
          status: encounter?.status,
        }
      );
      router.push(path);
    },
    [router]
  );

  const handleCreateEncounter = useCallback(() => {
    if (!canCreateClinicalRecords) return;
    router.push('/clinical/encounters/create');
  }, [canCreateClinicalRecords, router]);

  return {
    cards,
    recentEncounters,
    canCreateClinicalRecords,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onOpenResource: handleOpenResource,
    onOpenEncounter: handleOpenEncounter,
    onCreateEncounter: handleCreateEncounter,
  };
};

export default useClinicalOverviewScreen;
