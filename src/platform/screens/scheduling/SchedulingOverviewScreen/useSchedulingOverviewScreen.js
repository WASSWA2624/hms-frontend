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

const resolveAppointmentDisplayName = (appointment, fallbackLabel, t) => {
  const reason = sanitizeString(appointment?.reason);
  if (reason) return reason;

  const patientLabel = [
    appointment?.patient_name,
    appointment?.patient_display_name,
    appointment?.patient_full_name,
  ]
    .map((value) => sanitizeString(value))
    .find(Boolean);

  if (patientLabel) {
    return t('scheduling.overview.appointmentForPatient', {
      patient: patientLabel,
    });
  }

  const businessIdentifier = [
    appointment?.appointment_code,
    appointment?.appointment_number,
    appointment?.booking_reference,
    appointment?.visit_reference,
    appointment?.external_reference,
  ]
    .map((value) => sanitizeString(value))
    .find(Boolean);

  return businessIdentifier || fallbackLabel;
};

const resolveAppointmentSubtitle = (appointment, fallbackLabel) => {
  const status = sanitizeString(appointment?.status);
  const scheduledAt = sanitizeString(
    appointment?.scheduled_start || appointment?.start_time || appointment?.scheduled_for
  );
  if (status && scheduledAt) return `${status} - ${scheduledAt}`;
  if (status) return status;
  if (scheduledAt) return scheduledAt;
  return fallbackLabel;
};

const compareRecentAppointments = (left, right) => {
  const updatedAtDiff = toTimestamp(right?.updated_at) - toTimestamp(left?.updated_at);
  if (updatedAtDiff !== 0) return updatedAtDiff;

  const scheduledAtDiff = toTimestamp(right?.scheduled_start) - toTimestamp(left?.scheduled_start);
  if (scheduledAtDiff !== 0) return scheduledAtDiff;

  const createdAtDiff = toTimestamp(right?.created_at) - toTimestamp(left?.created_at);
  if (createdAtDiff !== 0) return createdAtDiff;

  const leftReason = sanitizeString(left?.reason);
  const rightReason = sanitizeString(right?.reason);
  const reasonDiff = leftReason.localeCompare(rightReason);
  if (reasonDiff !== 0) return reasonDiff;

  const leftCode = sanitizeString(left?.appointment_code || left?.appointment_number);
  const rightCode = sanitizeString(right?.appointment_code || right?.appointment_number);
  return leftCode.localeCompare(rightCode);
};

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
  const canViewOverview = isResolved && canAccessScheduling && hasScope;

  const appointmentItems = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  }, [data]);

  const recentAppointments = useMemo(
    () =>
      [...appointmentItems]
        .sort(compareRecentAppointments)
        .slice(0, 5)
        .map((appointment, index) => {
          const fallbackName = t('scheduling.overview.unnamedAppointment', {
            position: index + 1,
          });
          return {
            ...appointment,
            displayName: resolveAppointmentDisplayName(appointment, fallbackName, t),
            subtitle: resolveAppointmentSubtitle(
              appointment,
              t('scheduling.overview.unknownSchedule')
            ),
            listKey: sanitizeString(appointment?.id) || `recent-appointment-${index + 1}`,
          };
        }),
    [appointmentItems, t]
  );

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

  const overviewSummary = useMemo(
    () => ({
      scope: canManageAllTenants
        ? t('scheduling.overview.scopeSummaryAllTenants')
        : t('scheduling.overview.scopeSummaryTenant'),
      access: canCreateSchedulingRecords
        ? t('scheduling.overview.accessSummaryReadWrite')
        : t('scheduling.overview.accessSummaryReadOnly'),
      recentCount: t('scheduling.overview.recentAppointmentsCount', {
        count: recentAppointments.length,
      }),
    }),
    [canManageAllTenants, canCreateSchedulingRecords, recentAppointments.length, t]
  );

  const helpContent = useMemo(
    () => ({
      label: t('scheduling.overview.helpLabel'),
      tooltip: t('scheduling.overview.helpTooltip'),
      title: t('scheduling.overview.helpTitle'),
      body: t('scheduling.overview.helpBody'),
      items: [
        t('scheduling.overview.helpItems.scope'),
        t('scheduling.overview.helpItems.sequence'),
        t('scheduling.overview.helpItems.access'),
        t('scheduling.overview.helpItems.recovery'),
      ],
    }),
    [t]
  );

  const loadAppointments = useCallback(() => {
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
      if (!canViewOverview) return;
      router.push(routePath);
    },
    [canViewOverview, router]
  );

  const handleOpenAppointment = useCallback(
    (appointment) => {
      if (!canViewOverview) return;
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
    [canViewOverview, router]
  );

  const handleCreateAppointment = useCallback(() => {
    if (!canViewOverview || !canCreateSchedulingRecords) return;
    router.push('/scheduling/appointments/create');
  }, [canViewOverview, canCreateSchedulingRecords, router]);

  return {
    cards,
    overviewSummary,
    helpContent,
    recentAppointments,
    canCreateSchedulingRecords,
    showCreateAppointmentAction: canViewOverview && canCreateSchedulingRecords,
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
