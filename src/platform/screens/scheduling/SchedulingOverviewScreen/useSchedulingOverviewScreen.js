/**
 * Shared logic for SchedulingOverviewScreen.
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useAppointment, useI18n, useNetwork, useSchedulingAccess } from '@hooks';
import {
  getSchedulingResourceConfig,
  SCHEDULING_RESOURCE_LIST_ORDER,
  sanitizeString,
  withSchedulingContext,
} from '../schedulingResourceConfigs';
import { resolveErrorMessage } from '../schedulingScreenUtils';

const useSchedulingOverviewScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const {
    canAccessScheduling,
    canCreateSchedulingRecords,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  } = useSchedulingAccess();

  const { list, data, isLoading, errorCode, reset } = useAppointment();

  const normalizedTenantId = useMemo(() => sanitizeString(tenantId), [tenantId]);
  const normalizedFacilityId = useMemo(() => sanitizeString(facilityId), [facilityId]);
  const hasScope = canManageAllTenants || Boolean(normalizedTenantId);

  const appointmentItems = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  }, [data]);

  const recentAppointments = useMemo(() => appointmentItems.slice(0, 5), [appointmentItems]);

  const cards = useMemo(
    () =>
      SCHEDULING_RESOURCE_LIST_ORDER.map((resourceId) => {
        const config = getSchedulingResourceConfig(resourceId);
        return {
          id: resourceId,
          routePath: config?.routePath || '/scheduling',
          label: t(`${config?.i18nKey}.pluralLabel`),
          description: t(`${config?.i18nKey}.overviewDescription`),
        };
      }),
    [t]
  );

  const errorMessage = useMemo(
    () => resolveErrorMessage(t, errorCode, 'scheduling.overview.loadError'),
    [t, errorCode]
  );

  const loadAppointments = useCallback(() => {
    if (!isResolved || !canAccessScheduling || !hasScope) return;
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
    canAccessScheduling,
    hasScope,
    canManageAllTenants,
    normalizedTenantId,
    normalizedFacilityId,
    reset,
    list,
  ]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canAccessScheduling || !hasScope) {
      router.replace('/dashboard');
    }
  }, [isResolved, canAccessScheduling, hasScope, router]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleRetry = useCallback(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleOpenResource = useCallback(
    (routePath) => {
      router.push(routePath);
    },
    [router]
  );

  const handleOpenAppointment = useCallback(
    (appointment) => {
      const appointmentId = sanitizeString(appointment?.id);
      if (!appointmentId) return;
      const path = withSchedulingContext(
        `/scheduling/appointments/${appointmentId}`,
        {
          patientId: appointment?.patient_id,
          providerUserId: appointment?.provider_user_id,
          appointmentId: appointmentId,
        }
      );
      router.push(path);
    },
    [router]
  );

  const handleCreateAppointment = useCallback(() => {
    if (!canCreateSchedulingRecords) return;
    router.push('/scheduling/appointments/create');
  }, [canCreateSchedulingRecords, router]);

  return {
    cards,
    recentAppointments,
    canCreateSchedulingRecords,
    isLoading: !isResolved || isLoading,
    hasError: isResolved && Boolean(errorCode),
    errorMessage,
    isOffline,
    onRetry: handleRetry,
    onOpenResource: handleOpenResource,
    onOpenAppointment: handleOpenAppointment,
    onCreateAppointment: handleCreateAppointment,
  };
};

export default useSchedulingOverviewScreen;
