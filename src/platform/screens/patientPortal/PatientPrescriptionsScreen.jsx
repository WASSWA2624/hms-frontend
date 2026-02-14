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
  Snackbar,
  Stack,
  Text,
} from '@platform/components';
import { useI18n, useNetwork, usePharmacyOrder, usePharmacyOrderItem } from '@hooks';
import { formatDateTime } from '@utils';
import { normalizeList, resolveEnumLabel, usePatientPortalScope } from './shared';

const buildScopedParams = ({ patientId, tenantId, facilityId }) => {
  const params = {
    page: 1,
    limit: 50,
    patient_id: patientId,
  };
  if (tenantId) params.tenant_id = tenantId;
  if (facilityId) params.facility_id = facilityId;
  return params;
};

const PatientPrescriptionsScreen = () => {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { isOffline } = useNetwork();
  const scope = usePatientPortalScope();
  const toScopedPath = scope.toScopedPath;
  const pharmacyOrderListApi = usePharmacyOrder();
  const pharmacyOrderDetailApi = usePharmacyOrder();
  const pharmacyOrderItemListApi = usePharmacyOrderItem();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [notice, setNotice] = useState(null);

  const loadOrders = useCallback(async () => {
    if (!scope.isScopeReady) return;
    setIsRefreshing(true);
    pharmacyOrderListApi.reset();
    await pharmacyOrderListApi.list(
      buildScopedParams({
        patientId: scope.effectivePatientId,
        tenantId: scope.effectiveTenantId,
        facilityId: scope.effectiveFacilityId,
      })
    );
    setIsRefreshing(false);
  }, [
    pharmacyOrderListApi,
    scope.effectiveFacilityId,
    scope.effectivePatientId,
    scope.effectiveTenantId,
    scope.isScopeReady,
  ]);

  useEffect(() => {
    if (!scope.isScopeReady) return;
    loadOrders();
  }, [loadOrders, scope.isScopeReady]);

  const orders = useMemo(
    () =>
      normalizeList(pharmacyOrderListApi.data)
        .filter((order) => {
          const patientId = String(order?.patient_id || '').trim();
          return patientId === scope.effectivePatientId;
        })
        .sort((left, right) => {
          const leftTime = new Date(left?.ordered_at || left?.created_at || 0).getTime();
          const rightTime = new Date(right?.ordered_at || right?.created_at || 0).getTime();
          return rightTime - leftTime;
        }),
    [pharmacyOrderListApi.data, scope.effectivePatientId]
  );

  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) return null;
    const detail = pharmacyOrderDetailApi.data;
    if (
      detail &&
      typeof detail === 'object' &&
      !Array.isArray(detail) &&
      String(detail?.id || '') === String(selectedOrderId)
    ) {
      return detail;
    }
    return orders.find((order) => String(order?.id || '') === String(selectedOrderId)) || null;
  }, [orders, pharmacyOrderDetailApi.data, selectedOrderId]);

  const orderItems = useMemo(
    () =>
      normalizeList(pharmacyOrderItemListApi.data).filter(
        (item) => String(item?.pharmacy_order_id || '') === String(selectedOrderId || '')
      ),
    [pharmacyOrderItemListApi.data, selectedOrderId]
  );

  const handleSelectOrder = useCallback(
    async (order) => {
      if (!order) return;
      const orderId = String(order?.id || '').trim();
      if (!orderId) return;
      setSelectedOrderId(orderId);
      pharmacyOrderDetailApi.reset();
      pharmacyOrderItemListApi.reset();

      const detail = await pharmacyOrderDetailApi.get(orderId);
      if (!detail || typeof detail !== 'object') return;
      const patientId = String(detail?.patient_id || '').trim();
      if (patientId !== scope.effectivePatientId) {
        setSelectedOrderId(null);
        setNotice({
          variant: 'error',
          message: t('patientPortal.common.accessDenied'),
        });
        return;
      }

      await pharmacyOrderItemListApi.list({
        page: 1,
        limit: 50,
        pharmacy_order_id: orderId,
      });
    },
    [
      pharmacyOrderDetailApi,
      pharmacyOrderItemListApi,
      scope.effectivePatientId,
      t,
    ]
  );

  const hasError = Boolean(
    pharmacyOrderListApi.errorCode ||
      pharmacyOrderDetailApi.errorCode ||
      pharmacyOrderItemListApi.errorCode
  );
  const isLoading =
    !scope.isScopeReady ||
    isRefreshing ||
    pharmacyOrderListApi.isLoading ||
    pharmacyOrderDetailApi.isLoading ||
    pharmacyOrderItemListApi.isLoading;

  if (!scope.isScopeReady) {
    return (
      <Container size="medium" testID="patient-prescriptions-loading">
        <LoadingSpinner accessibilityLabel={t('common.loading')} />
      </Container>
    );
  }

  return (
    <Container size="medium" testID="patient-prescriptions-screen">
      <Stack spacing="md">
        {notice ? (
          <Snackbar
            visible={Boolean(notice?.message)}
            message={notice?.message || ''}
            variant={notice?.variant || 'info'}
            position="bottom"
            onDismiss={() => setNotice(null)}
            testID="patient-prescriptions-notice"
          />
        ) : null}

        <Stack spacing="xs">
          <Text variant="h3">{t('patientPortal.prescriptions.title')}</Text>
          <Text variant="body">{t('patientPortal.prescriptions.description')}</Text>
        </Stack>

        <Button
          variant="surface"
          size="small"
          onPress={() => router.push(toScopedPath('/portal'))}
          accessibilityLabel={t('patientPortal.common.backToPortal')}
          accessibilityHint={t('patientPortal.common.backToPortalHint')}
          testID="patient-prescriptions-back"
        >
          {t('patientPortal.common.backToPortal')}
        </Button>

        <Card testID="patient-prescriptions-readonly-note">
          <Stack spacing="xs">
            <Text variant="label">{t('patientPortal.prescriptions.readOnlyTitle')}</Text>
            <Text variant="caption">{t('patientPortal.prescriptions.readOnlyMessage')}</Text>
          </Stack>
        </Card>

        {isOffline ? (
          <OfflineState
            size={OfflineStateSizes.SMALL}
            title={t('shell.banners.offline.title')}
            description={t('patientPortal.prescriptions.offlineMessage')}
            testID="patient-prescriptions-offline"
          />
        ) : null}

        {hasError ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('patientPortal.prescriptions.loadErrorTitle')}
            description={t('patientPortal.prescriptions.loadErrorMessage')}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={loadOrders}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
                testID="patient-prescriptions-retry"
              >
                {t('common.retry')}
              </Button>
            )}
            testID="patient-prescriptions-error"
          />
        ) : null}

        <Button
          variant="surface"
          size="small"
          onPress={loadOrders}
          accessibilityLabel={t('patientPortal.prescriptions.refresh')}
          accessibilityHint={t('patientPortal.prescriptions.refreshHint')}
          testID="patient-prescriptions-refresh"
        >
          {t('patientPortal.prescriptions.refresh')}
        </Button>

        {isLoading ? (
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="patient-prescriptions-loading-indicator" />
        ) : null}

        {!isLoading && orders.length === 0 ? (
          <EmptyState
            title={t('patientPortal.prescriptions.emptyTitle')}
            description={t('patientPortal.prescriptions.emptyMessage')}
            testID="patient-prescriptions-empty"
          />
        ) : null}

        {orders.map((order) => (
          <Card key={order.id} testID={`patient-prescriptions-item-${order.id}`}>
            <Stack spacing="xs">
              <Text variant="label">
                {formatDateTime(order?.ordered_at || order?.created_at, locale)}
              </Text>
              <Text variant="caption">
                {t('patientPortal.prescriptions.itemStatus', {
                  status: resolveEnumLabel(t, 'patientPortal.prescriptions.status', order?.status),
                })}
              </Text>
              <Text variant="caption">
                {t('patientPortal.prescriptions.itemEncounter', {
                  encounter: String(order?.encounter_id || '').trim() || t('patientPortal.common.notAvailable'),
                })}
              </Text>
              <Button
                variant="surface"
                size="small"
                onPress={() => handleSelectOrder(order)}
                accessibilityLabel={t('patientPortal.prescriptions.viewDetails')}
                accessibilityHint={t('patientPortal.prescriptions.viewDetailsHint')}
                testID={`patient-prescriptions-view-${order.id}`}
              >
                {t('patientPortal.prescriptions.viewDetails')}
              </Button>
            </Stack>
          </Card>
        ))}

        {selectedOrder ? (
          <Card accessibilityLabel={t('patientPortal.prescriptions.detailTitle')} testID="patient-prescriptions-detail">
            <Stack spacing="xs">
              <Text variant="label">{t('patientPortal.prescriptions.detailTitle')}</Text>
              <Text variant="caption">
                {t('patientPortal.prescriptions.detailStatus', {
                  status: resolveEnumLabel(t, 'patientPortal.prescriptions.status', selectedOrder?.status),
                })}
              </Text>
              <Text variant="caption">
                {t('patientPortal.prescriptions.detailOrderedAt', {
                  when: formatDateTime(selectedOrder?.ordered_at || selectedOrder?.created_at, locale),
                })}
              </Text>
              <Text variant="caption">
                {t('patientPortal.prescriptions.detailEncounter', {
                  encounter:
                    String(selectedOrder?.encounter_id || '').trim() ||
                    t('patientPortal.common.notAvailable'),
                })}
              </Text>

              <Text variant="label">{t('patientPortal.prescriptions.itemsTitle')}</Text>
              {pharmacyOrderItemListApi.isLoading ? (
                <LoadingSpinner accessibilityLabel={t('common.loading')} testID="patient-prescriptions-items-loading" />
              ) : orderItems.length === 0 ? (
                <Text variant="caption">{t('patientPortal.prescriptions.itemsEmpty')}</Text>
              ) : (
                orderItems.map((item) => (
                  <Card
                    key={item.id}
                    variant="outlined"
                    testID={`patient-prescriptions-order-item-${item.id}`}
                  >
                    <Stack spacing="xs">
                      <Text variant="caption">
                        {t('patientPortal.prescriptions.itemDrug', {
                          drugId:
                            String(item?.drug_id || '').trim() || t('patientPortal.common.notAvailable'),
                        })}
                      </Text>
                      <Text variant="caption">
                        {t('patientPortal.prescriptions.itemQuantity', {
                          quantity:
                            String(item?.quantity || '').trim() || t('patientPortal.common.notAvailable'),
                        })}
                      </Text>
                      <Text variant="caption">
                        {t('patientPortal.prescriptions.itemStatus', {
                          status: resolveEnumLabel(
                            t,
                            'patientPortal.prescriptions.status',
                            item?.status
                          ),
                        })}
                      </Text>
                    </Stack>
                  </Card>
                ))
              )}
            </Stack>
          </Card>
        ) : null}
      </Stack>
    </Container>
  );
};

export default PatientPrescriptionsScreen;
