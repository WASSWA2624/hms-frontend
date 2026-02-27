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
  StyledContainer,
  StyledDescription,
  StyledErrorText,
  StyledFilterGrid,
  StyledHeader,
  StyledHeading,
  StyledInfoText,
  StyledInlineActions,
  StyledItemHeader,
  StyledItemMeta,
  StyledItemTitle,
  StyledLayout,
  StyledList,
  StyledListItem,
  StyledPanel,
  StyledSectionTitle,
  StyledSnapshotField,
  StyledSnapshotGrid,
  StyledSnapshotLabel,
  StyledSnapshotValue,
  StyledSubsection,
  StyledSuccessText,
  StyledSummaryCard,
  StyledSummaryGrid,
  StyledSummaryLabel,
  StyledSummaryValue,
  StyledTitle,
  StyledWorklist,
  StyledWorklistItem,
} from './RadiologyWorkbenchScreen.styles';

const STATUS_ICON = {
  ORDERED: '\u{1F4CB}',
  IN_PROCESS: '\u{1F3A5}',
  COMPLETED: '\u2705',
  CANCELLED: '\u26D4',
};

const toSelectOptions = (options = [], fallbackLabel = '') => [
  { value: '', label: fallbackLabel },
  ...(Array.isArray(options)
    ? options.map((entry) =>
        typeof entry === 'string'
          ? { value: entry, label: entry.replace(/_/g, ' ') }
          : { value: entry.value, label: entry.label || entry.value }
      )
    : []),
];

const renderSnapshotField = (label, value, fallback) => (
  <StyledSnapshotField>
    <StyledSnapshotLabel>{label}</StyledSnapshotLabel>
    <StyledSnapshotValue>{value || fallback}</StyledSnapshotValue>
  </StyledSnapshotField>
);

const RadiologyWorkbenchScreen = () => {
  const { t } = useI18n();
  const screen = useRadiologyWorkbenchScreen();

  const stageOptions = toSelectOptions(screen.stageOptions, t('radiology.workbench.filters.allStages'));
  const statusOptions = toSelectOptions(
    screen.statusOptions,
    t('radiology.workbench.filters.allStatuses')
  );
  const modalityOptions = toSelectOptions(
    screen.modalityOptions,
    t('radiology.workbench.filters.allModalities')
  );
  const studyOptions = toSelectOptions(screen.studyOptions, t('common.selectOption'));
  const draftResultOptions = toSelectOptions(
    screen.draftResultOptions,
    t('radiology.workbench.reporting.noDraftResult')
  );
  const finalResultOptions = toSelectOptions(
    screen.finalResultOptions,
    t('radiology.workbench.reporting.noFinalResult')
  );

  return (
    <StyledContainer testID="radiology-workbench-screen">
      <StyledHeader>
        <StyledHeading>
          <StyledTitle>{t('radiology.workbench.title')}</StyledTitle>
          <StyledDescription>{t('radiology.workbench.description')}</StyledDescription>
        </StyledHeading>
        <StyledInlineActions>
          <Button
            variant="surface"
            size="small"
            onPress={screen.onOpenOrderRoute}
            disabled={!screen.selectedOrderId}
            icon={<Icon glyph="\u{1F50E}" size="xs" decorative />}
          >
            {t('radiology.workbench.quickLinks.openOrder')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={screen.onRetry}
            icon={<Icon glyph="\u21BB" size="xs" decorative />}
            testID="radiology-workbench-refresh"
          >
            {t('common.retry')}
          </Button>
        </StyledInlineActions>
      </StyledHeader>

      {screen.isLoading ? (
        <LoadingSpinner
          accessibilityLabel={t('common.loading')}
          testID="radiology-workbench-loading"
        />
      ) : null}

      {!screen.isLoading && !screen.canViewWorkbench ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title={t('radiology.workbench.states.accessDeniedTitle')}
          description={t('radiology.workbench.states.accessDeniedDescription')}
          testID="radiology-workbench-access-denied"
        />
      ) : null}

      {!screen.isLoading && screen.hasError ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title={t('radiology.workbench.states.loadErrorTitle')}
          description={screen.errorCode || t('radiology.workbench.states.loadErrorDescription')}
          testID="radiology-workbench-error"
        />
      ) : null}

      {!screen.isLoading ? (
        <OfflineState
          size={OfflineStateSizes.SMALL}
          title={t('shell.banners.offline.title')}
          description={t('radiology.workbench.states.offlineNotice')}
          testID="radiology-workbench-offline"
          style={{ display: screen.isOffline ? 'block' : 'none' }}
        />
      ) : null}

      {!screen.isLoading && screen.canViewWorkbench ? (
        <>
          <StyledSummaryGrid>
            {screen.summaryCards.map((card) => (
              <StyledSummaryCard key={card.id}>
                <StyledSummaryLabel>{card.label}</StyledSummaryLabel>
                <StyledSummaryValue>{card.value}</StyledSummaryValue>
              </StyledSummaryCard>
            ))}
          </StyledSummaryGrid>

          <StyledLayout>
            <StyledPanel>
              <Card variant="outlined">
                <StyledSectionTitle>{t('radiology.workbench.list.title')}</StyledSectionTitle>
                <StyledFilterGrid>
                  <TextField
                    label={t('radiology.workbench.filters.search')}
                    value={screen.searchText}
                    onChangeText={screen.onSearchChange}
                    density="compact"
                  />
                  <Select
                    label={t('radiology.workbench.filters.stage')}
                    value={screen.stageFilter}
                    options={stageOptions}
                    onValueChange={screen.onStageFilterChange}
                    compact
                  />
                  <Select
                    label={t('radiology.workbench.filters.status')}
                    value={screen.statusFilter}
                    options={statusOptions}
                    onValueChange={screen.onStatusFilterChange}
                    compact
                  />
                  <Select
                    label={t('radiology.workbench.filters.modality')}
                    value={screen.modalityFilter}
                    options={modalityOptions}
                    onValueChange={screen.onModalityFilterChange}
                    compact
                  />
                </StyledFilterGrid>
                <StyledInlineActions>
                  <Button variant="surface" size="small" onPress={screen.onClearFilters}>
                    {t('radiology.workbench.filters.clear')}
                  </Button>
                  <Text variant="caption">
                    {t('radiology.workbench.list.count', { count: screen.worklist.length })}
                  </Text>
                </StyledInlineActions>
              </Card>

              <Card variant="outlined">
                {screen.worklist.length === 0 ? (
                  <EmptyState
                    title={t('radiology.workbench.states.emptyTitle')}
                    description={t('radiology.workbench.states.emptyDescription')}
                  />
                ) : (
                  <StyledWorklist>
                    {screen.worklist.map((order, index) => {
                      const orderId = order.display_id || order.id;
                      const isSelected =
                        String(screen.selectedOrderId || '').toUpperCase() ===
                        String(orderId || '').toUpperCase();
                      const status = String(order.status || '').toUpperCase();
                      return (
                        <StyledWorklistItem
                          key={orderId || `radiology-order-${index + 1}`}
                          $selected={isSelected}
                          onPress={() => screen.onSelectOrder(order)}
                          accessibilityRole="button"
                        >
                          <StyledItemHeader>
                            <StyledItemTitle>
                              {order.patient_display_name || t('common.notAvailable')}
                            </StyledItemTitle>
                            <Badge>{status || t('common.notAvailable')}</Badge>
                          </StyledItemHeader>
                          <StyledItemMeta>
                            <Icon glyph={STATUS_ICON[status] || '\u{1F3A5}'} size="xs" decorative />{' '}
                            {`${t('radiology.workbench.snapshot.orderId')}: ${orderId || t('common.notAvailable')}`}
                          </StyledItemMeta>
                          <StyledItemMeta>{screen.buildWorklistCountLabel(order)}</StyledItemMeta>
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
                  <StyledSectionTitle>{t('radiology.workbench.snapshot.title')}</StyledSectionTitle>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={screen.onOpenPatientProfile}
                    disabled={!screen.selectedSummary.patientId}
                  >
                    {t('radiology.workbench.quickLinks.patient')}
                  </Button>
                </StyledInlineActions>
                {!screen.selectedWorkflow?.order ? (
                  <EmptyState
                    title={t('radiology.workbench.states.noSelectionTitle')}
                    description={t('radiology.workbench.states.noSelectionDescription')}
                  />
                ) : (
                  <StyledSnapshotGrid>
                    {renderSnapshotField(
                      t('radiology.workbench.snapshot.orderId'),
                      screen.selectedSummary.orderId,
                      t('common.notAvailable')
                    )}
                    {renderSnapshotField(
                      t('radiology.workbench.snapshot.patient'),
                      screen.selectedSummary.patientName,
                      t('common.notAvailable')
                    )}
                    {renderSnapshotField(
                      t('radiology.workbench.snapshot.patientId'),
                      screen.selectedSummary.patientId,
                      t('common.notAvailable')
                    )}
                    {renderSnapshotField(
                      t('radiology.workbench.snapshot.encounterId'),
                      screen.selectedSummary.encounterId,
                      t('common.notAvailable')
                    )}
                    {renderSnapshotField(
                      t('radiology.workbench.snapshot.test'),
                      screen.selectedSummary.testName,
                      t('common.notAvailable')
                    )}
                    {renderSnapshotField(
                      t('radiology.workbench.snapshot.modality'),
                      screen.selectedSummary.modality,
                      t('common.notAvailable')
                    )}
                    {renderSnapshotField(
                      t('radiology.workbench.snapshot.status'),
                      screen.selectedSummary.status,
                      t('common.notAvailable')
                    )}
                    {renderSnapshotField(
                      t('radiology.workbench.snapshot.orderedAt'),
                      screen.selectedSummary.orderedAt,
                      t('common.notAvailable')
                    )}
                    {renderSnapshotField(
                      t('radiology.workbench.snapshot.studyCount'),
                      String(screen.selectedSummary.studyCount || 0),
                      '0'
                    )}
                    {renderSnapshotField(
                      t('radiology.workbench.snapshot.resultCount'),
                      String(screen.selectedSummary.resultCount || 0),
                      '0'
                    )}
                  </StyledSnapshotGrid>
                )}
              </Card>

              <Card variant="outlined">
                <StyledSectionTitle>{t('radiology.workbench.studies.title')}</StyledSectionTitle>
                {screen.studies.length === 0 ? (
                  <EmptyState
                    title={t('radiology.workbench.studies.emptyTitle')}
                    description={t('radiology.workbench.studies.emptyDescription')}
                  />
                ) : (
                  <StyledList>
                    {screen.studies.map((study, index) => {
                      const studyId = study.display_id || study.id || `study-${index + 1}`;
                      const links = Number(study.pacs_link_count || 0);
                      const syncLabel = links > 0 ? t('radiology.workbench.studies.synced') : t('radiology.workbench.studies.pending');
                      return (
                        <StyledListItem key={studyId}>
                          {`${studyId} • ${study.modality || 'OTHER'} • ${syncLabel}`}
                        </StyledListItem>
                      );
                    })}
                  </StyledList>
                )}

                <StyledSubsection>
                  <StyledSectionTitle>{t('radiology.workbench.studies.createTitle')}</StyledSectionTitle>
                  <StyledActionGrid>
                    <Select
                      label={t('radiology.workbench.studies.modality')}
                      value={screen.drafts.study.modality}
                      options={modalityOptions}
                      onValueChange={(value) => screen.onDraftChange('study', 'modality', value)}
                      compact
                    />
                    <TextField
                      label={t('radiology.workbench.studies.performedAt')}
                      type="datetime-local"
                      value={screen.drafts.study.performed_at}
                      onChangeText={(value) => screen.onDraftChange('study', 'performed_at', value)}
                      density="compact"
                    />
                    <TextArea
                      label={t('radiology.workbench.studies.notes')}
                      value={screen.drafts.study.notes}
                      onChangeText={(value) => screen.onDraftChange('study', 'notes', value)}
                      rows={2}
                    />
                    <Button
                      variant="primary"
                      size="small"
                      onPress={screen.onCreateStudy}
                      disabled={!screen.canMutate || !screen.actionMatrix.canCreateStudy}
                    >
                      {t('radiology.workbench.studies.createAction')}
                    </Button>
                  </StyledActionGrid>
                </StyledSubsection>

                <StyledSubsection>
                  <StyledSectionTitle>{t('radiology.workbench.studies.captureTitle')}</StyledSectionTitle>
                  <StyledActionGrid>
                    <Select
                      label={t('radiology.workbench.studies.study')}
                      value={screen.drafts.asset.study_id}
                      options={studyOptions}
                      onValueChange={(value) => screen.onDraftChange('asset', 'study_id', value)}
                      compact
                      searchable
                    />
                    <TextField
                      label={t('radiology.workbench.studies.fileName')}
                      value={screen.drafts.asset.file_name}
                      onChangeText={(value) => screen.onDraftChange('asset', 'file_name', value)}
                      density="compact"
                    />
                    <TextField
                      label={t('radiology.workbench.studies.contentType')}
                      value={screen.drafts.asset.content_type}
                      onChangeText={(value) => screen.onDraftChange('asset', 'content_type', value)}
                      density="compact"
                    />
                    <Button
                      variant="surface"
                      size="small"
                      onPress={screen.onCaptureAsset}
                      disabled={!screen.canMutate || !screen.actionMatrix.canCaptureAsset}
                    >
                      {t('radiology.workbench.studies.captureAction')}
                    </Button>
                  </StyledActionGrid>
                </StyledSubsection>

                <StyledSubsection>
                  <StyledSectionTitle>{t('radiology.workbench.studies.syncTitle')}</StyledSectionTitle>
                  <StyledActionGrid>
                    <Select
                      label={t('radiology.workbench.studies.study')}
                      value={screen.drafts.sync.study_id}
                      options={studyOptions}
                      onValueChange={(value) => screen.onDraftChange('sync', 'study_id', value)}
                      compact
                      searchable
                    />
                    <TextField
                      label={t('radiology.workbench.studies.studyUid')}
                      value={screen.drafts.sync.study_uid}
                      onChangeText={(value) => screen.onDraftChange('sync', 'study_uid', value)}
                      density="compact"
                    />
                    <TextArea
                      label={t('radiology.workbench.studies.notes')}
                      value={screen.drafts.sync.notes}
                      onChangeText={(value) => screen.onDraftChange('sync', 'notes', value)}
                      rows={2}
                    />
                    <Button
                      variant="surface"
                      size="small"
                      onPress={screen.onSyncStudy}
                      disabled={!screen.canMutate || !screen.actionMatrix.canSyncStudy}
                    >
                      {t('radiology.workbench.studies.syncAction')}
                    </Button>
                  </StyledActionGrid>
                  {screen.lastSyncStatus ? (
                    <StyledSuccessText>
                      {t('radiology.workbench.studies.syncStatus', {
                        status: screen.lastSyncStatus,
                      })}
                    </StyledSuccessText>
                  ) : null}
                  {screen.lastSyncError ? <StyledErrorText>{screen.lastSyncError}</StyledErrorText> : null}
                </StyledSubsection>
              </Card>

              <Card variant="outlined">
                <StyledSectionTitle>{t('radiology.workbench.timeline.title')}</StyledSectionTitle>
                {screen.timelineItems.length === 0 ? (
                  <EmptyState
                    title={t('radiology.workbench.timeline.emptyTitle')}
                    description={t('radiology.workbench.timeline.emptyDescription')}
                  />
                ) : (
                  <StyledList>
                    {screen.timelineItems.map((entry) => (
                      <StyledListItem key={entry.id}>{`${entry.label} | ${entry.timestamp}`}</StyledListItem>
                    ))}
                  </StyledList>
                )}
              </Card>
            </StyledPanel>

            <StyledPanel>
              <Card variant="outlined">
                <StyledSectionTitle>{t('radiology.workbench.actions.title')}</StyledSectionTitle>
                <StyledActionGrid>
                  <TextField
                    label={t('radiology.workbench.actions.assignee')}
                    value={screen.drafts.assign.assignee_user_id}
                    onChangeText={(value) => screen.onDraftChange('assign', 'assignee_user_id', value)}
                    density="compact"
                  />
                  <TextArea
                    label={t('radiology.workbench.actions.notes')}
                    value={screen.drafts.assign.notes}
                    onChangeText={(value) => screen.onDraftChange('assign', 'notes', value)}
                    rows={2}
                  />
                  <Button
                    variant="surface"
                    size="small"
                    onPress={screen.onAssign}
                    disabled={!screen.canMutate || !screen.actionMatrix.canAssign}
                  >
                    {t('radiology.workbench.actions.assign')}
                  </Button>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={screen.onStart}
                    disabled={!screen.canMutate || !screen.actionMatrix.canStart}
                  >
                    {t('radiology.workbench.actions.start')}
                  </Button>
                  <Button
                    variant="primary"
                    size="small"
                    onPress={screen.onComplete}
                    disabled={!screen.canMutate || !screen.actionMatrix.canComplete}
                  >
                    {t('radiology.workbench.actions.complete')}
                  </Button>
                  <TextField
                    label={t('radiology.workbench.actions.cancelReason')}
                    value={screen.drafts.cancel.reason}
                    onChangeText={(value) => screen.onDraftChange('cancel', 'reason', value)}
                    density="compact"
                  />
                  <TextArea
                    label={t('radiology.workbench.actions.cancelNotes')}
                    value={screen.drafts.cancel.notes}
                    onChangeText={(value) => screen.onDraftChange('cancel', 'notes', value)}
                    rows={2}
                  />
                  <Button
                    variant="surface"
                    size="small"
                    onPress={screen.onCancel}
                    disabled={!screen.canMutate || !screen.actionMatrix.canCancel}
                  >
                    {t('radiology.workbench.actions.cancel')}
                  </Button>
                </StyledActionGrid>
              </Card>

              <Card variant="outlined">
                <StyledSectionTitle>{t('radiology.workbench.reporting.title')}</StyledSectionTitle>
                <StyledActionGrid>
                  <TextArea
                    label={t('radiology.workbench.reporting.findings')}
                    value={screen.drafts.report.findings}
                    onChangeText={(value) => screen.onDraftChange('report', 'findings', value)}
                    rows={3}
                  />
                  <TextArea
                    label={t('radiology.workbench.reporting.impression')}
                    value={screen.drafts.report.impression}
                    onChangeText={(value) => screen.onDraftChange('report', 'impression', value)}
                    rows={3}
                  />
                  <TextArea
                    label={t('radiology.workbench.reporting.fullReport')}
                    value={screen.drafts.report.report_text}
                    onChangeText={(value) => screen.onDraftChange('report', 'report_text', value)}
                    rows={5}
                  />
                  <TextField
                    label={t('radiology.workbench.reporting.reportedAt')}
                    type="datetime-local"
                    value={screen.drafts.report.reported_at}
                    onChangeText={(value) => screen.onDraftChange('report', 'reported_at', value)}
                    density="compact"
                  />
                  <Button
                    variant="primary"
                    size="small"
                    onPress={screen.onDraftResult}
                    disabled={!screen.canMutate || !screen.actionMatrix.canDraftResult}
                  >
                    {t('radiology.workbench.reporting.saveDraft')}
                  </Button>
                </StyledActionGrid>

                <StyledSubsection>
                  <StyledSectionTitle>{t('radiology.workbench.reporting.finalizeTitle')}</StyledSectionTitle>
                  <StyledActionGrid>
                    <Select
                      label={t('radiology.workbench.reporting.draftResult')}
                      value={screen.drafts.finalize.result_id}
                      options={draftResultOptions}
                      onValueChange={(value) => screen.onDraftChange('finalize', 'result_id', value)}
                      compact
                      searchable
                    />
                    <TextArea
                      label={t('radiology.workbench.reporting.finalizeNotes')}
                      value={screen.drafts.finalize.notes}
                      onChangeText={(value) => screen.onDraftChange('finalize', 'notes', value)}
                      rows={2}
                    />
                    <Button
                      variant="surface"
                      size="small"
                      onPress={screen.onFinalizeResult}
                      disabled={!screen.canMutate || !screen.actionMatrix.canFinalizeResult}
                    >
                      {t('radiology.workbench.reporting.finalizeAction')}
                    </Button>
                  </StyledActionGrid>
                </StyledSubsection>

                <StyledSubsection>
                  <StyledSectionTitle>{t('radiology.workbench.reporting.addendumTitle')}</StyledSectionTitle>
                  <StyledActionGrid>
                    <Select
                      label={t('radiology.workbench.reporting.finalResult')}
                      value={screen.drafts.addendum.result_id}
                      options={finalResultOptions}
                      onValueChange={(value) => screen.onDraftChange('addendum', 'result_id', value)}
                      compact
                      searchable
                    />
                    <TextArea
                      label={t('radiology.workbench.reporting.addendumText')}
                      value={screen.drafts.addendum.addendum_text}
                      onChangeText={(value) => screen.onDraftChange('addendum', 'addendum_text', value)}
                      rows={3}
                    />
                    <Button
                      variant="surface"
                      size="small"
                      onPress={screen.onAddendumResult}
                      disabled={!screen.canMutate || !screen.actionMatrix.canAddendum}
                    >
                      {t('radiology.workbench.reporting.addendumAction')}
                    </Button>
                  </StyledActionGrid>
                </StyledSubsection>
              </Card>

              {screen.formError ? <StyledErrorText>{screen.formError}</StyledErrorText> : null}
              {!screen.formError ? (
                <StyledInfoText>{t('radiology.workbench.helperText')}</StyledInfoText>
              ) : null}
            </StyledPanel>
          </StyledLayout>
        </>
      ) : null}
    </StyledContainer>
  );
};

export default RadiologyWorkbenchScreen;

