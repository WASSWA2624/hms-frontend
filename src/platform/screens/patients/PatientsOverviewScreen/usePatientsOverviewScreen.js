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

  const patientItems = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  }, [data]);

  const recentPatients = useMemo(() => patientItems.slice(0, 5), [patientItems]);

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

  const loadPatients = useCallback(() => {
    if (!isResolved || !canAccessPatients || !hasScope) return;
    const params = { page: 1, limit: 20 };
    if (!canManageAllTenants) {
      params.tenant_id = normalizedTenantId;
    }
    reset();
    list(params);
  }, [
    isResolved,
    canAccessPatients,
    hasScope,
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
      router.push(routePath);
    },
    [router]
  );

  const handleOpenPatient = useCallback(
    (patientId) => {
      const safeId = sanitizeString(patientId);
      if (!safeId) return;
      router.push(withPatientContext(`/patients/patients/${safeId}`, safeId));
    },
    [router]
  );

  const handleRegisterPatient = useCallback(() => {
    if (!canCreatePatientRecords) return;
    router.push('/patients/patients/create');
  }, [canCreatePatientRecords, router]);

  return {
    cards,
    recentPatients,
    canCreatePatientRecords,
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
