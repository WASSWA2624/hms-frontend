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
  Select,
  Snackbar,
  Stack,
  Text,
} from '@platform/components';
import {
  useI18n,
  useImagingStudy,
  useLabOrder,
  useLabOrderItem,
  useLabResult,
  useNetwork,
  useRadiologyOrder,
  useRadiologyResult,
} from '@hooks';
import { formatDateTime } from '@utils';
import { normalizeList, resolveEnumLabel, usePatientPortalScope } from './shared';

const RESULT_TYPES = {
  LAB: 'LAB',
  RADIOLOGY: 'RADIOLOGY',
  IMAGING: 'IMAGING',
};

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

const buildResultItem = ({ id, type, status, occurredAt, summary, relatedId }) => ({
  key: `${type}:${id}`,
  id: String(id || ''),
  type,
  status: String(status || '').toUpperCase(),
  occurredAt: occurredAt || null,
  summary: summary || '',
  relatedId: relatedId || '',
});

const PatientResultsScreen = () => {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { isOffline } = useNetwork();
  const scope = usePatientPortalScope();
  const toScopedPath = scope.toScopedPath;
  const labOrderListApi = useLabOrder();
  const labOrderItemListApi = useLabOrderItem();
  const labResultListApi = useLabResult();
  const labResultDetailApi = useLabResult();
  const radiologyOrderListApi = useRadiologyOrder();
  const radiologyResultListApi = useRadiologyResult();
  const radiologyResultDetailApi = useRadiologyResult();
  const imagingStudyListApi = useImagingStudy();
  const imagingStudyDetailApi = useImagingStudy();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [resultTypeFilter, setResultTypeFilter] = useState('ALL');
  const [combinedResults, setCombinedResults] = useState([]);
  const [knownLabOrderItemIds, setKnownLabOrderItemIds] = useState([]);
  const [knownRadiologyOrderIds, setKnownRadiologyOrderIds] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [notice, setNotice] = useState(null);

  const typeOptions = useMemo(
    () => [
      { label: t('patientPortal.filters.allTypes'), value: 'ALL' },
      { label: t('patientPortal.results.typeLabels.LAB'), value: RESULT_TYPES.LAB },
      { label: t('patientPortal.results.typeLabels.RADIOLOGY'), value: RESULT_TYPES.RADIOLOGY },
      { label: t('patientPortal.results.typeLabels.IMAGING'), value: RESULT_TYPES.IMAGING },
    ],
    [t]
  );

  const loadResults = useCallback(async () => {
    if (!scope.isScopeReady) return;

    setIsRefreshing(true);
    setCombinedResults([]);
    setKnownLabOrderItemIds([]);
    setKnownRadiologyOrderIds([]);
    setSelectedResult(null);
    setSelectedDetail(null);

    labOrderListApi.reset();
    labOrderItemListApi.reset();
    labResultListApi.reset();
    radiologyOrderListApi.reset();
    radiologyResultListApi.reset();
    imagingStudyListApi.reset();

    const labOrdersResponse = await labOrderListApi.list(
      buildScopedParams({
        patientId: scope.effectivePatientId,
        tenantId: scope.effectiveTenantId,
        facilityId: scope.effectiveFacilityId,
      })
    );
    const labOrders = normalizeList(labOrdersResponse);
    const labOrderIds = labOrders
      .map((order) => String(order?.id || '').trim())
      .filter(Boolean);

    const labOrderItems = [];
    for (const labOrderId of labOrderIds) {
      const labItemsResponse = await labOrderItemListApi.list({
        page: 1,
        limit: 50,
        lab_order_id: labOrderId,
      });
      labOrderItems.push(...normalizeList(labItemsResponse));
    }

    const labOrderIdByItemId = new Map(
      labOrderItems.map((item) => [String(item?.id || '').trim(), String(item?.lab_order_id || '').trim()])
    );
    const labOrderItemIds = labOrderItems
      .map((item) => String(item?.id || '').trim())
      .filter(Boolean);
    setKnownLabOrderItemIds(labOrderItemIds);

    const labResults = [];
    for (const labOrderItemId of labOrderItemIds) {
      const labResultsResponse = await labResultListApi.list({
        page: 1,
        limit: 50,
        lab_order_item_id: labOrderItemId,
      });
      const items = normalizeList(labResultsResponse);
      items.forEach((result) => {
        const summary = [
          String(result?.result_value || '').trim(),
          String(result?.result_unit || '').trim(),
        ]
          .filter(Boolean)
          .join(' ')
          .trim();
        labResults.push(
          buildResultItem({
            id: result?.id,
            type: RESULT_TYPES.LAB,
            status: result?.status,
            occurredAt: result?.reported_at || result?.updated_at || result?.created_at,
            summary: summary || String(result?.result_text || '').trim(),
            relatedId: labOrderIdByItemId.get(String(result?.lab_order_item_id || '').trim()) || '',
          })
        );
      });
    }

    const radiologyOrdersResponse = await radiologyOrderListApi.list(
      buildScopedParams({
        patientId: scope.effectivePatientId,
        tenantId: scope.effectiveTenantId,
        facilityId: scope.effectiveFacilityId,
      })
    );
    const radiologyOrders = normalizeList(radiologyOrdersResponse);
    const radiologyOrderIds = radiologyOrders
      .map((order) => String(order?.id || '').trim())
      .filter(Boolean);
    setKnownRadiologyOrderIds(radiologyOrderIds);

    const radiologyResults = [];
    for (const radiologyOrderId of radiologyOrderIds) {
      const radiologyResultsResponse = await radiologyResultListApi.list({
        page: 1,
        limit: 50,
        radiology_order_id: radiologyOrderId,
      });
      normalizeList(radiologyResultsResponse).forEach((result) => {
        radiologyResults.push(
          buildResultItem({
            id: result?.id,
            type: RESULT_TYPES.RADIOLOGY,
            status: result?.status,
            occurredAt: result?.reported_at || result?.updated_at || result?.created_at,
            summary: String(result?.report_text || '').trim(),
            relatedId: String(result?.radiology_order_id || '').trim(),
          })
        );
      });
    }

    const imagingStudies = [];
    for (const radiologyOrderId of radiologyOrderIds) {
      const imagingResponse = await imagingStudyListApi.list({
        page: 1,
        limit: 50,
        radiology_order_id: radiologyOrderId,
      });
      normalizeList(imagingResponse).forEach((study) => {
        imagingStudies.push(
          buildResultItem({
            id: study?.id,
            type: RESULT_TYPES.IMAGING,
            status: study?.modality,
            occurredAt: study?.performed_at || study?.updated_at || study?.created_at,
            summary: resolveEnumLabel(t, 'patientPortal.results.imagingModality', study?.modality),
            relatedId: String(study?.radiology_order_id || '').trim(),
          })
        );
      });
    }

    setCombinedResults(
      [...labResults, ...radiologyResults, ...imagingStudies].sort((left, right) => {
        const leftTime = new Date(left?.occurredAt || 0).getTime();
        const rightTime = new Date(right?.occurredAt || 0).getTime();
        return rightTime - leftTime;
      })
    );
    setIsRefreshing(false);
  }, [
    imagingStudyListApi,
    labOrderItemListApi,
    labOrderListApi,
    labResultListApi,
    radiologyOrderListApi,
    radiologyResultListApi,
    scope.effectiveFacilityId,
    scope.effectivePatientId,
    scope.effectiveTenantId,
    scope.isScopeReady,
    t,
  ]);

  useEffect(() => {
    if (!scope.isScopeReady) return;
    loadResults();
  }, [loadResults, scope.isScopeReady]);

  const filteredResults = useMemo(
    () =>
      combinedResults.filter((result) => {
        if (resultTypeFilter === 'ALL') return true;
        return result.type === resultTypeFilter;
      }),
    [combinedResults, resultTypeFilter]
  );

  const handleSelectResult = useCallback(
    async (result) => {
      if (!result) return;
      setSelectedResult(result);
      setSelectedDetail(null);
      labResultDetailApi.reset();
      radiologyResultDetailApi.reset();
      imagingStudyDetailApi.reset();

      if (result.type === RESULT_TYPES.LAB) {
        const detail = await labResultDetailApi.get(result.id);
        if (!detail || typeof detail !== 'object') return;
        const detailItemId = String(detail?.lab_order_item_id || '').trim();
        if (!detailItemId || !knownLabOrderItemIds.includes(detailItemId)) {
          setNotice({
            variant: 'error',
            message: t('patientPortal.common.accessDenied'),
          });
          setSelectedResult(null);
          return;
        }
        setSelectedDetail(detail || null);
        return;
      }

      if (result.type === RESULT_TYPES.RADIOLOGY) {
        const detail = await radiologyResultDetailApi.get(result.id);
        if (!detail || typeof detail !== 'object') return;
        const orderId = String(detail?.radiology_order_id || '').trim();
        if (!orderId || !knownRadiologyOrderIds.includes(orderId)) {
          setNotice({
            variant: 'error',
            message: t('patientPortal.common.accessDenied'),
          });
          setSelectedResult(null);
          return;
        }
        setSelectedDetail(detail || null);
        return;
      }

      if (result.type === RESULT_TYPES.IMAGING) {
        const detail = await imagingStudyDetailApi.get(result.id);
        if (!detail || typeof detail !== 'object') return;
        const orderId = String(detail?.radiology_order_id || '').trim();
        if (!orderId || !knownRadiologyOrderIds.includes(orderId)) {
          setNotice({
            variant: 'error',
            message: t('patientPortal.common.accessDenied'),
          });
          setSelectedResult(null);
          return;
        }
        setSelectedDetail(detail || null);
      }
    },
    [
      imagingStudyDetailApi,
      knownLabOrderItemIds,
      knownRadiologyOrderIds,
      labResultDetailApi,
      radiologyResultDetailApi,
      t,
    ]
  );

  const hasError = Boolean(
    labOrderListApi.errorCode ||
      labOrderItemListApi.errorCode ||
      labResultListApi.errorCode ||
      radiologyOrderListApi.errorCode ||
      radiologyResultListApi.errorCode ||
      imagingStudyListApi.errorCode ||
      labResultDetailApi.errorCode ||
      radiologyResultDetailApi.errorCode ||
      imagingStudyDetailApi.errorCode
  );

  const isLoading =
    !scope.isScopeReady ||
    isRefreshing ||
    labOrderListApi.isLoading ||
    labOrderItemListApi.isLoading ||
    labResultListApi.isLoading ||
    radiologyOrderListApi.isLoading ||
    radiologyResultListApi.isLoading ||
    imagingStudyListApi.isLoading;

  const detailLoading =
    labResultDetailApi.isLoading ||
    radiologyResultDetailApi.isLoading ||
    imagingStudyDetailApi.isLoading;

  if (!scope.isScopeReady) {
    return (
      <Container size="medium" testID="patient-results-loading">
        <LoadingSpinner accessibilityLabel={t('common.loading')} />
      </Container>
    );
  }

  return (
    <Container size="medium" testID="patient-results-screen">
      <Stack spacing="md">
        {notice ? (
          <Snackbar
            visible={Boolean(notice?.message)}
            message={notice?.message || ''}
            variant={notice?.variant || 'info'}
            position="bottom"
            onDismiss={() => setNotice(null)}
            testID="patient-results-notice"
          />
        ) : null}

        <Stack spacing="xs">
          <Text variant="h3">{t('patientPortal.results.title')}</Text>
          <Text variant="body">{t('patientPortal.results.description')}</Text>
        </Stack>

        <Button
          variant="surface"
          size="small"
          onPress={() => router.push(toScopedPath('/portal'))}
          accessibilityLabel={t('patientPortal.common.backToPortal')}
          accessibilityHint={t('patientPortal.common.backToPortalHint')}
          testID="patient-results-back"
        >
          {t('patientPortal.common.backToPortal')}
        </Button>

        <Card testID="patient-results-readonly-note">
          <Stack spacing="xs">
            <Text variant="label">{t('patientPortal.results.readOnlyTitle')}</Text>
            <Text variant="caption">{t('patientPortal.results.readOnlyMessage')}</Text>
          </Stack>
        </Card>

        {isOffline ? (
          <OfflineState
            size={OfflineStateSizes.SMALL}
            title={t('shell.banners.offline.title')}
            description={t('patientPortal.results.offlineMessage')}
            testID="patient-results-offline"
          />
        ) : null}

        {hasError ? (
          <ErrorState
            size={ErrorStateSizes.SMALL}
            title={t('patientPortal.results.loadErrorTitle')}
            description={t('patientPortal.results.loadErrorMessage')}
            action={(
              <Button
                variant="surface"
                size="small"
                onPress={loadResults}
                accessibilityLabel={t('common.retry')}
                accessibilityHint={t('common.retryHint')}
                testID="patient-results-retry"
              >
                {t('common.retry')}
              </Button>
            )}
            testID="patient-results-error"
          />
        ) : null}

        <Card accessibilityLabel={t('patientPortal.results.filterLabel')} testID="patient-results-filters">
          <Stack spacing="sm">
            <Select
              label={t('patientPortal.results.filterTypeLabel')}
              value={resultTypeFilter}
              options={typeOptions}
              onValueChange={setResultTypeFilter}
              accessibilityLabel={t('patientPortal.results.filterTypeLabel')}
              accessibilityHint={t('patientPortal.results.filterTypeHint')}
              testID="patient-results-type-filter"
            />
            <Button
              variant="surface"
              size="small"
              onPress={loadResults}
              accessibilityLabel={t('patientPortal.results.refresh')}
              accessibilityHint={t('patientPortal.results.refreshHint')}
              testID="patient-results-refresh"
            >
              {t('patientPortal.results.refresh')}
            </Button>
          </Stack>
        </Card>

        {isLoading ? (
          <LoadingSpinner accessibilityLabel={t('common.loading')} testID="patient-results-loading-indicator" />
        ) : null}

        {!isLoading && filteredResults.length === 0 ? (
          <EmptyState
            title={t('patientPortal.results.emptyTitle')}
            description={t('patientPortal.results.emptyMessage')}
            testID="patient-results-empty"
          />
        ) : null}

        {filteredResults.map((result) => {
          const statusLabel =
            result.type === RESULT_TYPES.LAB
              ? resolveEnumLabel(t, 'patientPortal.results.labStatus', result.status)
              : result.type === RESULT_TYPES.RADIOLOGY
                ? resolveEnumLabel(t, 'patientPortal.results.radiologyStatus', result.status)
                : resolveEnumLabel(t, 'patientPortal.results.imagingModality', result.status);
          return (
            <Card key={result.key} testID={`patient-results-item-${result.key}`}>
              <Stack spacing="xs">
                <Text variant="label">{t(`patientPortal.results.typeLabels.${result.type}`)}</Text>
                <Text variant="caption">
                  {formatDateTime(result.occurredAt, locale)}
                </Text>
                <Text variant="caption">
                  {t('patientPortal.results.itemStatus', { status: statusLabel })}
                </Text>
                <Text variant="caption">
                  {result.summary || t('patientPortal.common.notAvailable')}
                </Text>
                <Button
                  variant="surface"
                  size="small"
                  onPress={() => handleSelectResult(result)}
                  accessibilityLabel={t('patientPortal.results.viewDetails')}
                  accessibilityHint={t('patientPortal.results.viewDetailsHint')}
                  testID={`patient-results-view-${result.key}`}
                >
                  {t('patientPortal.results.viewDetails')}
                </Button>
              </Stack>
            </Card>
          );
        })}

        {selectedResult ? (
          <Card accessibilityLabel={t('patientPortal.results.detailTitle')} testID="patient-results-detail">
            <Stack spacing="xs">
              <Text variant="label">{t('patientPortal.results.detailTitle')}</Text>
              {detailLoading ? (
                <LoadingSpinner accessibilityLabel={t('common.loading')} testID="patient-results-detail-loading" />
              ) : (
                <>
                  <Text variant="caption">
                    {t('patientPortal.results.detailType', {
                      type: t(`patientPortal.results.typeLabels.${selectedResult.type}`),
                    })}
                  </Text>
                  <Text variant="caption">
                    {t('patientPortal.results.detailStatus', {
                      status:
                        selectedResult.type === RESULT_TYPES.LAB
                          ? resolveEnumLabel(t, 'patientPortal.results.labStatus', selectedDetail?.status)
                          : selectedResult.type === RESULT_TYPES.RADIOLOGY
                            ? resolveEnumLabel(t, 'patientPortal.results.radiologyStatus', selectedDetail?.status)
                            : resolveEnumLabel(t, 'patientPortal.results.imagingModality', selectedDetail?.modality),
                    })}
                  </Text>
                  <Text variant="caption">
                    {t('patientPortal.results.detailDate', {
                      when: formatDateTime(
                        selectedDetail?.reported_at ||
                          selectedDetail?.performed_at ||
                          selectedDetail?.updated_at ||
                          selectedDetail?.created_at,
                        locale
                      ),
                    })}
                  </Text>
                  <Text variant="caption">
                    {selectedResult.type === RESULT_TYPES.LAB
                      ? t('patientPortal.results.detailLabSummary', {
                          value: String(selectedDetail?.result_value || '').trim() || t('patientPortal.common.notAvailable'),
                          unit: String(selectedDetail?.result_unit || '').trim() || t('patientPortal.common.notAvailable'),
                          text: String(selectedDetail?.result_text || '').trim() || t('patientPortal.common.notAvailable'),
                        })
                      : selectedResult.type === RESULT_TYPES.RADIOLOGY
                        ? t('patientPortal.results.detailRadiologySummary', {
                            report:
                              String(selectedDetail?.report_text || '').trim() ||
                              t('patientPortal.common.notAvailable'),
                          })
                        : t('patientPortal.results.detailImagingSummary', {
                            modality: resolveEnumLabel(
                              t,
                              'patientPortal.results.imagingModality',
                              selectedDetail?.modality
                            ),
                          })}
                  </Text>
                </>
              )}
            </Stack>
          </Card>
        ) : null}
      </Stack>
    </Container>
  );
};

export default PatientResultsScreen;
