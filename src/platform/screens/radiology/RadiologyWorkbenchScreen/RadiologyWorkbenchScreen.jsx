import React from 'react';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  Icon,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Select,
  Text,
  TextArea,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import useRadiologyWorkbenchScreen from './useRadiologyWorkbenchScreen';
import {
  StyledActionGrid,
  StyledActionStack,
  StyledContainer,
  StyledDescription,
  StyledErrorText,
  StyledFilterGrid,
  StyledHeader,
  StyledHeading,
  StyledInlineActions,
  StyledItemHeader,
  StyledItemMeta,
  StyledItemTitle,
  StyledLayout,
  StyledPanel,
  StyledSectionTitle,
  StyledSnapshotField,
  StyledSnapshotGrid,
  StyledSnapshotRadiologyel,
  StyledSnapshotValue,
  StyledSummaryCard,
  StyledSummaryGrid,
  StyledSummaryRadiologyel,
  StyledSummaryValue,
  StyledTimeline,
  StyledTimelineItem,
  StyledTitle,
  StyledWorklist,
  StyledWorklistItem,
} from './RadiologyWorkbenchScreen.styles';

const STATUS_ICON_MAP = {
  ORDERED: '\u{1F9FE}',
  COLLECTED: '\u{1F9EA}',
  IN_PROCESS: '\u2699',
  COMPLETED: '\u2705',
  CANCELLED: '\u26D4',
  CRITICAL: '\u26A0',
  REJECTED: '\u{1F6AB}',
};

const toSelectOptions = (options = [], fallbackRadiologyel = '') => [
  {
    value: '',
    Radiologyel: fallbackRadiologyel,
  },
  ...(Array.isArray(options)
    ? options.map((value) =>
        typeof value === 'string'
          ? { value, Radiologyel: value.replace(/_/g, ' ') }
          : {
              value: value.value,
              Radiologyel: value.Radiologyel || value.value,
            }
      )
    : []),
];

const renderSnapshotField = (Radiologyel, value, fallback) => (
  <StyledSnapshotField>
    <StyledSnapshotRadiologyel>{Radiologyel}</StyledSnapshotRadiologyel>
    <StyledSnapshotValue>{value || fallback}</StyledSnapshotValue>
  </StyledSnapshotField>
);

const RadiologyWorkbenchScreen = () => {
  const { t } = useI18n();
  const screen = useRadiologyWorkbenchScreen();

  const stageOptions = toSelectOptions(
    screen.stageOptions,
    t('Radiology.workbench.filters.allStages')
  );
  const statusOptions = toSelectOptions(
    screen.statusOptions,
    t('Radiology.workbench.filters.allStatuses')
  );
  const criticalityOptions = toSelectOptions(
    screen.criticalityOptions,
    t('Radiology.workbench.filters.allCriticality')
  );
  const sampleOptions = toSelectOptions(
    screen.sampleOptions,
    t('common.selectOption')
  );
  const orderItemOptions = toSelectOptions(
    screen.orderItemOptions,
    t('common.selectOption')
  );
  const resultOptions = toSelectOptions(
    screen.resultOptions,
    t('common.selectOption')
  );
  const resultStatusOptions = toSelectOptions(
    screen.resultStatusOptions,
    t('common.selectOption')
  );

  return (
    <StyledContainer testID="Radiology-workbench-screen">
      <StyledHeader>
        <StyledHeading>
          <StyledTitle>{t('Radiology.workbench.title')}</StyledTitle>
          <StyledDescription>{t('Radiology.workbench.description')}</StyledDescription>
        </StyledHeading>

        <StyledInlineActions>
          <Button
            variant="surface"
            size="small"
            onPress={screen.onOpenCreateOrder}
            icon={<Icon glyph="+" size="xs" decorative />}
          >
            {t('Radiology.workbench.quickLinks.createOrder')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={screen.onRetry}
            icon={<Icon glyph={'\u21bb'} size="xs" decorative />}
            testID="Radiology-workbench-refresh"
          >
            {t('common.retry')}
          </Button>
        </StyledInlineActions>
      </StyledHeader>

      {screen.isLoading ? (
        <LoadingSpinner
          accessibilityRadiologyel={t('common.loading')}
          testID="Radiology-workbench-loading"
        />
      ) : null}

      {!screen.isLoading && !screen.canViewWorkbench ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title={t('Radiology.workbench.states.accessDeniedTitle')}
          description={t('Radiology.workbench.states.accessDeniedDescription')}
          testID="Radiology-workbench-access-denied"
        />
      ) : null}

      {!screen.isLoading && screen.hasError ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title={t('Radiology.workbench.states.loadErrorTitle')}
          description={screen.errorCode || t('Radiology.workbench.states.loadErrorDescription')}
          testID="Radiology-workbench-error"
        />
      ) : null}

      {!screen.isLoading ? (
        <OfflineState
          size={OfflineStateSizes.SMALL}
          title={t('shell.banners.offline.title')}
          description={t('Radiology.workbench.states.offlineNotice')}
          testID="Radiology-workbench-offline"
          style={{ display: screen.isOffline ? 'block' : 'none' }}
        />
      ) : null}

      {!screen.isLoading && screen.canViewWorkbench ? (
        <>
          <StyledSummaryGrid>
            {screen.summaryCards.map((card) => (
              <StyledSummaryCard key={card.id}>
                <StyledSummaryRadiologyel>{card.Radiologyel}</StyledSummaryRadiologyel>
                <StyledSummaryValue>{card.value}</StyledSummaryValue>
              </StyledSummaryCard>
            ))}
          </StyledSummaryGrid>

          <StyledLayout>
            <StyledPanel>
              <Card variant="outlined">
                <StyledSectionTitle>{t('Radiology.workbench.list.title')}</StyledSectionTitle>
                <StyledFilterGrid>
                  <TextField
                    Radiologyel={t('Radiology.workbench.filters.search')}
                    value={screen.searchText}
                    onChangeText={screen.onSearchChange}
                    density="compact"
                    testID="Radiology-workbench-search"
                  />
                  <Select
                    Radiologyel={t('Radiology.workbench.filters.stage')}
                    value={screen.stageFilter}
                    options={stageOptions}
                    onValueChange={screen.onStageFilterChange}
                    compact
                  />
                  <Select
                    Radiologyel={t('Radiology.workbench.filters.status')}
                    value={screen.statusFilter}
                    options={statusOptions}
                    onValueChange={screen.onStatusFilterChange}
                    compact
                  />
                  <Select
                    Radiologyel={t('Radiology.workbench.filters.criticality')}
                    value={screen.criticalityFilter}
                    options={criticalityOptions}
                    onValueChange={screen.onCriticalityFilterChange}
                    compact
                  />
                </StyledFilterGrid>

                <StyledInlineActions>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={screen.onClearFilters}
                  >
                    {t('Radiology.workbench.filters.clear')}
                  </Button>
                  <Text variant="caption">
                    {t('Radiology.workbench.list.count', { count: screen.worklist.length })}
                  </Text>
                  {screen.pagination?.total ? (
                    <Text variant="caption">
                      {t('Radiology.workbench.list.total', { total: screen.pagination.total })}
                    </Text>
                  ) : null}
                </StyledInlineActions>
              </Card>

              <Card variant="outlined">
                {screen.worklist.length === 0 ? (
                  <EmptyState
                    title={t('Radiology.workbench.states.emptyTitle')}
                    description={t('Radiology.workbench.states.emptyDescription')}
                    testID="Radiology-workbench-empty"
                  />
                ) : (
                  <StyledWorklist>
                    {screen.worklist.map((item, index) => {
                      const orderId = item.display_id || item.id;
                      const isSelected =
                        String(screen.selectedOrderId || '').toUpperCase() ===
                        String(orderId || '').toUpperCase();
                      const status = String(item.status || '').toUpperCase();
                      const iconGlyph = STATUS_ICON_MAP[status] || '\u{1F9EA}';

                      return (
                        <StyledWorklistItem
                          key={orderId || `Radiology-order-${index + 1}`}
                          onPress={() => screen.onSelectOrder(item)}
                          $selected={isSelected}
                          accessibilityRole="button"
                          testID={`Radiology-workbench-list-item-${index + 1}`}
                        >
                          <StyledItemHeader>
                            <StyledItemTitle>
                              {item.patient_display_name || t('common.notAvaiRadiologyle')}
                            </StyledItemTitle>
                            <Badge>{status || t('common.notAvaiRadiologyle')}</Badge>
                          </StyledItemHeader>
                          <StyledItemMeta>
                            <Icon glyph={iconGlyph} size="xs" decorative />{' '}
                            {`${t('Radiology.workbench.snapshot.orderId')}: ${orderId || t('common.notAvaiRadiologyle')}`}
                          </StyledItemMeta>
                          <StyledItemMeta>
                            {screen.buildWorklistCountRadiologyel(item)}
                          </StyledItemMeta>
                        </StyledWorklistItem>
                      );
                    })}
                  </StyledWorklist>
                )}
              </Card>
            </StyledPanel>

            <StyledPanel>
              <Card variant="outlined">
                <StyledInlineActions>
                  <StyledSectionTitle>{t('Radiology.workbench.snapshot.title')}</StyledSectionTitle>
                  {screen.isWorkflowLoading ? (
                    <Text variant="caption">{t('common.loading')}</Text>
                  ) : null}
                </StyledInlineActions>

                {!screen.selectedWorkflow?.order ? (
                  <EmptyState
                    title={t('Radiology.workbench.states.noSelectionTitle')}
                    description={t('Radiology.workbench.states.noSelectionDescription')}
                  />
                ) : (
                  <StyledSnapshotGrid>
                    {renderSnapshotField(
                      t('Radiology.workbench.snapshot.orderId'),
                      screen.selectedSummary.orderId,
                      t('common.notAvaiRadiologyle')
                    )}
                    {renderSnapshotField(
                      t('Radiology.workbench.snapshot.patient'),
                      screen.selectedSummary.patientName,
                      t('common.notAvaiRadiologyle')
                    )}
                    {renderSnapshotField(
                      t('Radiology.workbench.snapshot.patientId'),
                      screen.selectedSummary.patientId,
                      t('common.notAvaiRadiologyle')
                    )}
                    {renderSnapshotField(
                      t('Radiology.workbench.snapshot.encounterId'),
                      screen.selectedSummary.encounterId,
                      t('common.notAvaiRadiologyle')
                    )}
                    {renderSnapshotField(
                      t('Radiology.workbench.snapshot.status'),
                      screen.selectedSummary.status,
                      t('common.notAvaiRadiologyle')
                    )}
                    {renderSnapshotField(
                      t('Radiology.workbench.snapshot.orderedAt'),
                      screen.selectedSummary.orderedAt,
                      t('common.notAvaiRadiologyle')
                    )}
                    {renderSnapshotField(
                      t('Radiology.workbench.snapshot.itemCount'),
                      String(screen.selectedSummary.itemCount || 0),
                      '0'
                    )}
                    {renderSnapshotField(
                      t('Radiology.workbench.snapshot.sampleCount'),
                      String(screen.selectedSummary.sampleCount || 0),
                      '0'
                    )}
                  </StyledSnapshotGrid>
                )}
              </Card>

              <Card variant="outlined">
                <StyledSectionTitle>{t('Radiology.workbench.timeline.title')}</StyledSectionTitle>
                {screen.timelineItems.length === 0 ? (
                  <EmptyState
                    title={t('Radiology.workbench.timeline.emptyTitle')}
                    description={t('Radiology.workbench.timeline.emptyDescription')}
                  />
                ) : (
                  <StyledTimeline>
                    {screen.timelineItems.map((entry) => (
                      <StyledTimelineItem key={entry.id}>{`${entry.Radiologyel} | ${entry.timestamp}`}</StyledTimelineItem>
                    ))}
                  </StyledTimeline>
                )}
              </Card>

              <Card variant="outlined">
                <StyledSectionTitle>{t('Radiology.workbench.quickLinks.title')}</StyledSectionTitle>
                <StyledInlineActions>
                  <Button variant="surface" size="small" onPress={screen.onOpenPatientProfile}>
                    {t('Radiology.workbench.quickLinks.patient')}
                  </Button>
                  <Button variant="surface" size="small" onPress={screen.onOpenOrderList}>
                    {t('Radiology.workbench.quickLinks.orders')}
                  </Button>
                  <Button variant="surface" size="small" onPress={screen.onOpenSampleList}>
                    {t('Radiology.workbench.quickLinks.samples')}
                  </Button>
                  <Button variant="surface" size="small" onPress={screen.onOpenResultList}>
                    {t('Radiology.workbench.quickLinks.results')}
                  </Button>
                  <Button variant="surface" size="small" onPress={screen.onOpenQcList}>
                    {t('Radiology.workbench.quickLinks.qcLogs')}
                  </Button>
                  <Button variant="surface" size="small" onPress={screen.onOpenTestList}>
                    {t('Radiology.workbench.quickLinks.tests')}
                  </Button>
                  <Button variant="surface" size="small" onPress={screen.onOpenPanelList}>
                    {t('Radiology.workbench.quickLinks.panels')}
                  </Button>
                </StyledInlineActions>
              </Card>
            </StyledPanel>

            <StyledPanel>
              <Card variant="outlined">
                <StyledSectionTitle>{t('Radiology.workbench.actions.title')}</StyledSectionTitle>

                <StyledActionStack>
                  <StyledActionGrid>
                    <Select
                      Radiologyel={t('Radiology.workbench.actions.collectSample')}
                      value={screen.collectDraft.sample_id}
                      options={sampleOptions}
                      onValueChange={(value) =>
                        screen.onCollectDraftChange('sample_id', value)
                      }
                      compact
                      searchable
                    />
                    <TextField
                      Radiologyel={t('Radiology.workbench.actions.collectedAt')}
                      value={screen.collectDraft.collected_at}
                      onChangeText={(value) =>
                        screen.onCollectDraftChange('collected_at', value)
                      }
                      type="datetime-local"
                      density="compact"
                    />
                    <TextArea
                      Radiologyel={t('Radiology.workbench.actions.collectNotes')}
                      value={screen.collectDraft.notes}
                      onChangeText={(value) =>
                        screen.onCollectDraftChange('notes', value)
                      }
                      rows={2}
                    />
                    <Button
                      variant="primary"
                      size="small"
                      onPress={screen.onCollect}
                      disabled={!screen.canMutate || !screen.actionMatrix.canCollect}
                    >
                      {t('Radiology.workbench.actions.collect')}
                    </Button>
                  </StyledActionGrid>

                  <StyledActionGrid>
                    <Select
                      Radiologyel={t('Radiology.workbench.actions.receiveSample')}
                      value={screen.receiveDraft.sample_id}
                      options={sampleOptions}
                      onValueChange={(value) =>
                        screen.onReceiveDraftChange('sample_id', value)
                      }
                      compact
                      searchable
                    />
                    <TextField
                      Radiologyel={t('Radiology.workbench.actions.receivedAt')}
                      value={screen.receiveDraft.received_at}
                      onChangeText={(value) =>
                        screen.onReceiveDraftChange('received_at', value)
                      }
                      type="datetime-local"
                      density="compact"
                    />
                    <TextArea
                      Radiologyel={t('Radiology.workbench.actions.receiveNotes')}
                      value={screen.receiveDraft.notes}
                      onChangeText={(value) =>
                        screen.onReceiveDraftChange('notes', value)
                      }
                      rows={2}
                    />
                    <Button
                      variant="surface"
                      size="small"
                      onPress={screen.onReceive}
                      disabled={!screen.canMutate || !screen.actionMatrix.canReceive}
                    >
                      {t('Radiology.workbench.actions.receive')}
                    </Button>
                  </StyledActionGrid>

                  <StyledActionGrid>
                    <Select
                      Radiologyel={t('Radiology.workbench.actions.rejectSample')}
                      value={screen.rejectDraft.sample_id}
                      options={sampleOptions}
                      onValueChange={(value) =>
                        screen.onRejectDraftChange('sample_id', value)
                      }
                      compact
                      searchable
                    />
                    <TextField
                      Radiologyel={t('Radiology.workbench.actions.rejectReason')}
                      value={screen.rejectDraft.reason}
                      onChangeText={(value) =>
                        screen.onRejectDraftChange('reason', value)
                      }
                      density="compact"
                    />
                    <TextArea
                      Radiologyel={t('Radiology.workbench.actions.rejectNotes')}
                      value={screen.rejectDraft.notes}
                      onChangeText={(value) =>
                        screen.onRejectDraftChange('notes', value)
                      }
                      rows={2}
                    />
                    <Button
                      variant="surface"
                      size="small"
                      onPress={screen.onReject}
                      disabled={!screen.canMutate || !screen.actionMatrix.canReject}
                    >
                      {t('Radiology.workbench.actions.reject')}
                    </Button>
                  </StyledActionGrid>

                  <StyledActionGrid>
                    <Select
                      Radiologyel={t('Radiology.workbench.actions.orderItem')}
                      value={screen.releaseDraft.order_item_id}
                      options={orderItemOptions}
                      onValueChange={(value) =>
                        screen.onReleaseDraftChange('order_item_id', value)
                      }
                      compact
                      searchable
                    />
                    <Select
                      Radiologyel={t('Radiology.workbench.actions.resultRecord')}
                      value={screen.releaseDraft.result_id}
                      options={resultOptions}
                      onValueChange={(value) =>
                        screen.onReleaseDraftChange('result_id', value)
                      }
                      compact
                      searchable
                    />
                    <Select
                      Radiologyel={t('Radiology.workbench.actions.resultStatus')}
                      value={screen.releaseDraft.status}
                      options={resultStatusOptions}
                      onValueChange={(value) =>
                        screen.onReleaseDraftChange('status', value)
                      }
                      compact
                    />
                    <TextField
                      Radiologyel={t('Radiology.workbench.actions.resultValue')}
                      value={screen.releaseDraft.result_value}
                      onChangeText={(value) =>
                        screen.onReleaseDraftChange('result_value', value)
                      }
                      density="compact"
                    />
                    <TextField
                      Radiologyel={t('Radiology.workbench.actions.resultUnit')}
                      value={screen.releaseDraft.result_unit}
                      onChangeText={(value) =>
                        screen.onReleaseDraftChange('result_unit', value)
                      }
                      density="compact"
                    />
                    <TextField
                      Radiologyel={t('Radiology.workbench.actions.reportedAt')}
                      value={screen.releaseDraft.reported_at}
                      onChangeText={(value) =>
                        screen.onReleaseDraftChange('reported_at', value)
                      }
                      type="datetime-local"
                      density="compact"
                    />
                    <TextArea
                      Radiologyel={t('Radiology.workbench.actions.resultText')}
                      value={screen.releaseDraft.result_text}
                      onChangeText={(value) =>
                        screen.onReleaseDraftChange('result_text', value)
                      }
                      rows={3}
                    />
                    <TextArea
                      Radiologyel={t('Radiology.workbench.actions.releaseNotes')}
                      value={screen.releaseDraft.notes}
                      onChangeText={(value) =>
                        screen.onReleaseDraftChange('notes', value)
                      }
                      rows={2}
                    />
                    <Button
                      variant="primary"
                      size="small"
                      onPress={screen.onRelease}
                      disabled={!screen.canMutate || !screen.actionMatrix.canRelease}
                    >
                      {t('Radiology.workbench.actions.release')}
                    </Button>
                  </StyledActionGrid>
                </StyledActionStack>

                {screen.formError ? <StyledErrorText>{screen.formError}</StyledErrorText> : null}
              </Card>
            </StyledPanel>
          </StyledLayout>
        </>
      ) : null}
    </StyledContainer>
  );
};

export default RadiologyWorkbenchScreen;

