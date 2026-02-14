import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Button,
  Card,
  Container,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Stack,
  Text,
} from '@platform/components';
import {
  useAppointment,
  useI18n,
  useInsuranceClaim,
  useInvoice,
  useLabOrder,
  useNetwork,
  usePayment,
  usePharmacyOrder,
  useRadiologyOrder,
} from '@hooks';
import { formatDateTime } from '@utils';
import { normalizeList, resolveEnumLabel, usePatientPortalScope } from './shared';

const buildScopedParams = ({
  patientId,
  tenantId,
  facilityId,
  includePatient = true,
}) => {
  const params = { page: 1, limit: 50 };
  if (includePatient && patientId) params.patient_id = patientId;
  if (tenantId) params.tenant_id = tenantId;
  if (facilityId) params.facility_id = facilityId;
  return params;
};

const PatientPortalMainScreen = () => {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { isOffline } = useNetwork();
  const scope = usePatientPortalScope();
  const toScopedPath = scope.toScopedPath;
  const appointmentsApi = useAppointment();
  const labOrdersApi = useLabOrder();
  const radiologyOrdersApi = useRadiologyOrder();
  const pharmacyOrdersApi = usePharmacyOrder();
  const invoicesApi = useInvoice();
  const paymentsApi = usePayment();
  const claimsApi = useInsuranceClaim();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [claimsCount, setClaimsCount] = useState(0);

  const loadSummary = useCallback(async () => {
    if (!scope.isScopeReady) return;

    setIsRefreshing(true);
    setClaimsCount(0);

    appointmentsApi.reset();
    labOrdersApi.reset();
    radiologyOrdersApi.reset();
    pharmacyOrdersApi.reset();
    invoicesApi.reset();
    paymentsApi.reset();
    claimsApi.reset();

    const [appointments, labOrders, radiologyOrders, pharmacyOrders, invoices] = await Promise.all([
      appointmentsApi.list(
        buildScopedParams({
          patientId: scope.effectivePatientId,
          tenantId: scope.effectiveTenantId,
          facilityId: scope.effectiveFacilityId,
        })
      ),
      labOrdersApi.list(
        buildScopedParams({
          patientId: scope.effectivePatientId,
          tenantId: scope.effectiveTenantId,
          facilityId: scope.effectiveFacilityId,
          includePatient: true,
        })
      ),
      radiologyOrdersApi.list(
        buildScopedParams({
          patientId: scope.effectivePatientId,
          tenantId: scope.effectiveTenantId,
          facilityId: scope.effectiveFacilityId,
          includePatient: true,
        })
      ),
      pharmacyOrdersApi.list(
        buildScopedParams({
          patientId: scope.effectivePatientId,
          tenantId: scope.effectiveTenantId,
          facilityId: scope.effectiveFacilityId,
          includePatient: true,
        })
      ),
      invoicesApi.list(
        buildScopedParams({
          patientId: scope.effectivePatientId,
          tenantId: scope.effectiveTenantId,
          facilityId: scope.effectiveFacilityId,
          includePatient: true,
        })
      ),
      paymentsApi.list(
        buildScopedParams({
          patientId: scope.effectivePatientId,
          tenantId: scope.effectiveTenantId,
          facilityId: scope.effectiveFacilityId,
          includePatient: true,
        })
      ),
    ]);

    const invoiceIds = normalizeList(invoices)
      .map((invoice) => String(invoice?.id || '').trim())
      .filter(Boolean);

    if (invoiceIds.length > 0) {
      let totalClaims = 0;
      for (const invoiceId of invoiceIds) {
        const claims = await claimsApi.list({
          page: 1,
          limit: 50,
          invoice_id: invoiceId,
        });
        totalClaims += normalizeList(claims).length;
      }
      setClaimsCount(totalClaims);
    }

    // Keep references warm for readability and consistency in UI.
    void appointments;
    void labOrders;
    void radiologyOrders;
    void pharmacyOrders;

    setIsRefreshing(false);
  }, [
    appointmentsApi,
    claimsApi,
    invoicesApi,
    labOrdersApi,
    paymentsApi,
    pharmacyOrdersApi,
    radiologyOrdersApi,
    scope.effectiveFacilityId,
    scope.effectivePatientId,
    scope.effectiveTenantId,
    scope.isScopeReady,
  ]);

  useEffect(() => {
    if (!scope.isScopeReady) return;
    loadSummary();
  }, [loadSummary, scope.isScopeReady]);

  const appointments = useMemo(
    () =>
      normalizeList(appointmentsApi.data).filter((item) => {
        const recordPatientId = String(item?.patient_id || '').trim();
        return recordPatientId === scope.effectivePatientId;
      }),
    [appointmentsApi.data, scope.effectivePatientId]
  );

  const labOrders = useMemo(() => normalizeList(labOrdersApi.data), [labOrdersApi.data]);
  const radiologyOrders = useMemo(
    () => normalizeList(radiologyOrdersApi.data),
    [radiologyOrdersApi.data]
  );
  const pharmacyOrders = useMemo(
    () => normalizeList(pharmacyOrdersApi.data),
    [pharmacyOrdersApi.data]
  );
  const invoices = useMemo(() => normalizeList(invoicesApi.data), [invoicesApi.data]);
  const payments = useMemo(() => normalizeList(paymentsApi.data), [paymentsApi.data]);

  const upcomingAppointments = useMemo(
    () =>
      [...appointments]
        .filter((item) => {
          const status = String(item?.status || '').toUpperCase();
          return status !== 'CANCELLED' && status !== 'COMPLETED';
        })
        .sort((left, right) => {
          const leftTime = new Date(left?.scheduled_start || left?.scheduled_end || 0).getTime();
          const rightTime = new Date(right?.scheduled_start || right?.scheduled_end || 0).getTime();
          return leftTime - rightTime;
        })
        .slice(0, 5),
    [appointments]
  );

  const summaryCards = useMemo(
    () => [
      {
        id: 'appointments',
        label: t('patientPortal.portal.summary.appointments'),
        value: appointments.length,
        path: toScopedPath('/appointments'),
      },
      {
        id: 'results',
        label: t('patientPortal.portal.summary.results'),
        value: labOrders.length + radiologyOrders.length,
        path: toScopedPath('/results'),
      },
      {
        id: 'prescriptions',
        label: t('patientPortal.portal.summary.prescriptions'),
        value: pharmacyOrders.length,
        path: toScopedPath('/prescriptions'),
      },
      {
        id: 'billing',
        label: t('patientPortal.portal.summary.billing'),
        value: invoices.length + payments.length + claimsCount,
        path: toScopedPath('/billing'),
      },
    ],
    [
      appointments.length,
      claimsCount,
      invoices.length,
      labOrders.length,
      payments.length,
      pharmacyOrders.length,
      radiologyOrders.length,
      toScopedPath,
      t,
    ]
  );

  const hasError = Boolean(
    appointmentsApi.errorCode ||
      labOrdersApi.errorCode ||
      radiologyOrdersApi.errorCode ||
      pharmacyOrdersApi.errorCode ||
      invoicesApi.errorCode ||
      paymentsApi.errorCode ||
      claimsApi.errorCode
  );

  const isLoading =
    !scope.isScopeReady ||
    isRefreshing ||
    appointmentsApi.isLoading ||
    labOrdersApi.isLoading ||
    radiologyOrdersApi.isLoading ||
    pharmacyOrdersApi.isLoading ||
    invoicesApi.isLoading ||
    paymentsApi.isLoading ||
    claimsApi.isLoading;

  const hasContent =
    summaryCards.some((card) => card.value > 0) || upcomingAppointments.length > 0;

  if (!scope.isScopeReady) {
    return (
      <Container size="medium" testID="patient-portal-main-loading">
        <LoadingSpinner accessibilityLabel={t('common.loading')} />
      </Container>
    );
  }

  return (
    <Container size="medium" testID="patient-portal-main-screen">
      <Stack spacing="md">
        <Stack spacing="xs">
          <Text variant="h3">{t('patientPortal.portal.title')}</Text>
          <Text variant="body">{t('patientPortal.portal.description')}</Text>
        </Stack>

        {isOffline ? (
          <OfflineState
            size={OfflineStateSizes.SMALL}
            title={t('shell.banners.offline.title')}
            description={t('patientPortal.portal.offlineMessage')}
            testID="patient-portal-main-offline"
          />
        ) : null}

        {hasError ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('patientPortal.portal.loadErrorTitle')}
            description={t('patientPortal.portal.loadErrorMessage')}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={loadSummary}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
                testID="patient-portal-main-retry"
              >
                {t('common.retry')}
              </Button>
            )}
            testID="patient-portal-main-error"
          />
        ) : null}

        <Card accessibilityLabel={t('patientPortal.portal.quickActionsLabel')} testID="patient-portal-main-actions">
          <Stack spacing="xs">
            <Text variant="label">{t('patientPortal.portal.quickActionsTitle')}</Text>
            {summaryCards.map((card) => (
              <Button
                key={card.id}
                variant="surface"
                size="small"
                onPress={() => router.push(card.path)}
                accessibilityLabel={t('patientPortal.portal.openSectionLabel', { section: card.label })}
                accessibilityHint={t('patientPortal.portal.openSectionHint', { section: card.label })}
                testID={`patient-portal-main-open-${card.id}`}
              >
                {t('patientPortal.portal.openSectionAction', { section: card.label })}
              </Button>
            ))}
          </Stack>
        </Card>

        <Stack spacing="sm">
          {summaryCards.map((card) => (
            <Card key={card.id} testID={`patient-portal-main-summary-${card.id}`}>
              <Stack spacing="xs">
                <Text variant="label">{card.label}</Text>
                <Text variant="h3">{String(card.value)}</Text>
              </Stack>
            </Card>
          ))}
        </Stack>

        <Card accessibilityLabel={t('patientPortal.portal.upcomingLabel')} testID="patient-portal-main-upcoming">
          <Stack spacing="sm">
            <Text variant="label">{t('patientPortal.portal.upcomingTitle')}</Text>
            {upcomingAppointments.length === 0 ? (
              <EmptyState
                title={t('patientPortal.portal.noUpcomingTitle')}
                description={t('patientPortal.portal.noUpcomingMessage')}
                testID="patient-portal-main-upcoming-empty"
              />
            ) : (
              upcomingAppointments.map((appointment) => {
                const appointmentStatus = resolveEnumLabel(
                  t,
                  'patientPortal.appointments.status',
                  appointment?.status
                );
                const scheduledAt = appointment?.scheduled_start || appointment?.scheduled_end;
                return (
                  <Card key={appointment.id} variant="outlined" testID={`patient-portal-main-upcoming-${appointment.id}`}>
                    <Stack spacing="xs">
                      <Text variant="body">
                        {formatDateTime(scheduledAt, locale)}
                      </Text>
                      <Text variant="caption">
                        {t('patientPortal.portal.upcomingStatus', { status: appointmentStatus })}
                      </Text>
                      <Text variant="caption">
                        {appointment?.reason || t('patientPortal.common.notAvailable')}
                      </Text>
                    </Stack>
                  </Card>
                );
              })
            )}
          </Stack>
        </Card>

        {!isLoading && !hasError && !hasContent ? (
          <EmptyState
            title={t('patientPortal.portal.emptyTitle')}
            description={t('patientPortal.portal.emptyMessage')}
            testID="patient-portal-main-empty"
          />
        ) : null}
      </Stack>
    </Container>
  );
};

export default PatientPortalMainScreen;
