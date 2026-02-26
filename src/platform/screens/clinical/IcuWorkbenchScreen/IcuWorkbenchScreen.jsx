import React from 'react';
import {
  Accordion,
  Badge,
  Button,
  Card,
  Chip,
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
import useIcuWorkbenchScreen from './useIcuWorkbenchScreen';
import {
  StyledChipRow,
  StyledContainer,
  StyledDescription,
  StyledErrorText,
  StyledFieldRow,
  StyledFilterGrid,
  StyledFlowList,
  StyledFlowListItem,
  StyledFlowMeta,
  StyledFlowTitle,
  StyledFlowTitleRow,
  StyledHeader,
  StyledHeading,
  StyledInlineActions,
  StyledLayout,
  StyledPanel,
  StyledSectionTitle,
  StyledSnapshotField,
  StyledSnapshotGrid,
  StyledSnapshotLabel,
  StyledSnapshotValue,
  StyledTimeline,
  StyledTimelineItem,
  StyledTitle,
} from './IcuWorkbenchScreen.styles';

const toSelectOptions = (options = []) =>
  (Array.isArray(options) ? options : []).map((option) => ({
    value: option.value,
    label: option.label || option.value,
  }));

const renderSnapshotField = (label, value, fallback) => (
  <StyledSnapshotField>
    <StyledSnapshotLabel>{label}</StyledSnapshotLabel>
    <StyledSnapshotValue>{value || fallback}</StyledSnapshotValue>
  </StyledSnapshotField>
);

const IcuWorkbenchScreen = () => {
  const { t } = useI18n();
  const screen = useIcuWorkbenchScreen();
  const stageOptions = toSelectOptions(screen.stageOptions);
  const wardOptions = toSelectOptions(screen.wardOptions);
  const queueScopeOptions = toSelectOptions(screen.queueScopeOptions);
  const icuQueueScopeOptions = toSelectOptions(screen.icuQueueScopeOptions);
  const icuStatusOptions = toSelectOptions(screen.icuStatusOptions);
  const transferStatusOptions = toSelectOptions(screen.transferStatusOptions);
  const criticalSeverityOptions = toSelectOptions(
    screen.criticalSeverityOptions
  );
  const hasCriticalAlertOptions = toSelectOptions(
    screen.hasCriticalAlertOptions
  );
  const hasActiveBedOptions = toSelectOptions(screen.hasActiveBedOptions);
  const bedOptions = toSelectOptions(screen.bedOptions);
  const stayOptions = toSelectOptions(screen.stayOptions);
  const alertOptions = toSelectOptions(screen.alertOptions);
  const transferActionOptions = screen.transferActionOptions.map((value) => ({
    value,
    label: value,
  }));
  const medicationRouteOptions = screen.medicationRouteOptions.map((value) => ({
    value,
    label: value,
  }));

  return (
    <StyledContainer testID="icu-workbench-screen">
      <StyledHeader>
        <StyledHeading>
          <StyledTitle>ICU Command Center</StyledTitle>
          <StyledDescription>
            Centralized ICU operations for stays, observations, alerts, and
            inpatient actions.
          </StyledDescription>
        </StyledHeading>
        <Button
          variant="surface"
          size="small"
          onPress={screen.onRetry}
          icon={<Icon glyph={'\u21bb'} size="xs" decorative />}
          testID="icu-workbench-refresh"
        >
          {t('common.retry')}
        </Button>
      </StyledHeader>

      {screen.isLoading ? (
        <LoadingSpinner
          accessibilityLabel={t('common.loading')}
          testID="icu-workbench-loading"
        />
      ) : null}

      {!screen.isLoading && !screen.canViewWorkbench ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title="Access denied"
          description="You do not have access to the ICU workspace."
          testID="icu-workbench-access-denied"
        />
      ) : null}

      {!screen.isLoading && screen.hasError ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title="Unable to load ICU workspace"
          description={screen.errorCode || 'Please retry in a moment.'}
          testID="icu-workbench-error"
        />
      ) : null}

      {!screen.isLoading ? (
        <OfflineState
          size={OfflineStateSizes.SMALL}
          title={t('shell.banners.offline.title')}
          description="Offline mode: viewing cached ICU data."
          testID="icu-workbench-offline"
          style={{ display: screen.isOffline ? 'block' : 'none' }}
        />
      ) : null}

      {!screen.isLoading && screen.canViewWorkbench ? (
        <StyledLayout>
          <StyledPanel>
            <Card variant="outlined">
              <StyledSectionTitle>ICU Queue</StyledSectionTitle>
              <StyledFilterGrid>
                <TextField
                  label={t('ipd.workbench.filters.search')}
                  value={screen.searchText}
                  onChangeText={screen.onFlowSearchChange}
                  density="compact"
                  testID="icu-workbench-search"
                />
                <Select
                  label="Admission scope"
                  value={screen.queueScope}
                  options={queueScopeOptions}
                  onValueChange={screen.onQueueScopeChange}
                  compact
                />
                <Select
                  label="ICU queue scope"
                  value={screen.icuQueueScope}
                  options={icuQueueScopeOptions}
                  onValueChange={screen.onIcuQueueScopeChange}
                  compact
                />
                <Select
                  label={t('ipd.workbench.filters.stage')}
                  value={screen.stageFilter}
                  options={stageOptions}
                  onValueChange={screen.onStageFilterChange}
                  compact
                />
                <Select
                  label="ICU status"
                  value={screen.icuStatusFilter}
                  options={icuStatusOptions}
                  onValueChange={screen.onIcuStatusFilterChange}
                  compact
                />
                <Select
                  label={t('ipd.workbench.filters.transfer')}
                  value={screen.transferStatusFilter}
                  options={transferStatusOptions}
                  onValueChange={screen.onTransferStatusFilterChange}
                  compact
                />
                <Select
                  label="Critical severity"
                  value={screen.criticalSeverityFilter}
                  options={criticalSeverityOptions}
                  onValueChange={screen.onCriticalSeverityFilterChange}
                  compact
                />
                <Select
                  label="Critical alerts"
                  value={screen.hasCriticalAlertFilter}
                  options={hasCriticalAlertOptions}
                  onValueChange={screen.onHasCriticalAlertFilterChange}
                  compact
                />
                <Select
                  label={t('ipd.workbench.filters.ward')}
                  value={screen.wardFilter}
                  options={wardOptions}
                  onValueChange={screen.onWardFilterChange}
                  compact
                />
                <Select
                  label={t('ipd.workbench.filters.bedState')}
                  value={screen.hasActiveBedFilter}
                  options={hasActiveBedOptions}
                  onValueChange={screen.onHasActiveBedFilterChange}
                  compact
                />
              </StyledFilterGrid>
              <StyledInlineActions>
                <Button
                  variant="surface"
                  size="small"
                  onPress={screen.onClearFilters}
                >
                  {t('ipd.workbench.filters.clear')}
                </Button>
                <Button
                  variant="surface"
                  size="small"
                  onPress={() => screen.setIsStartIcuFormOpen((prev) => !prev)}
                  disabled={!screen.canMutate}
                  icon={<Icon glyph="+" size="xs" decorative />}
                >
                  Start ICU Stay
                </Button>
                <Button
                  variant="surface"
                  size="small"
                  onPress={() =>
                    screen.setIsObservationFormOpen((prev) => !prev)
                  }
                  disabled={!screen.canMutate}
                  icon={<Icon glyph={'\u2695'} size="xs" decorative />}
                >
                  Add Observation
                </Button>
                <Button
                  variant="surface"
                  size="small"
                  onPress={() => screen.setIsAlertFormOpen((prev) => !prev)}
                  disabled={!screen.canMutate}
                  icon={<Icon glyph={'\u26a0'} size="xs" decorative />}
                >
                  Raise Alert
                </Button>
              </StyledInlineActions>
            </Card>

            {screen.isStartIcuFormOpen ? (
              <Card variant="outlined" testID="icu-workbench-start-stay-form">
                <StyledSectionTitle>Start ICU Stay</StyledSectionTitle>
                <StyledFieldRow>
                  <TextField
                    label="Started at"
                    value={screen.startIcuDraft.started_at}
                    onChangeText={(value) =>
                      screen.onStartIcuDraftChange('started_at', value)
                    }
                    type="datetime-local"
                    density="compact"
                  />
                </StyledFieldRow>
                <StyledInlineActions>
                  <Button
                    variant="primary"
                    size="small"
                    onPress={screen.onStartIcuStay}
                    disabled={
                      !screen.canMutate || !screen.actionMatrix.canStartIcuStay
                    }
                  >
                    Start ICU Stay
                  </Button>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={screen.onEndIcuStay}
                    disabled={
                      !screen.canMutate || !screen.actionMatrix.canEndIcuStay
                    }
                  >
                    End Active ICU Stay
                  </Button>
                </StyledInlineActions>
              </Card>
            ) : null}

            {screen.isObservationFormOpen ? (
              <Card variant="outlined" testID="icu-workbench-observation-form">
                <StyledSectionTitle>ICU Observations</StyledSectionTitle>
                <StyledFieldRow>
                  <Select
                    label="ICU stay"
                    value={screen.observationDraft.icu_stay_id}
                    options={[
                      { value: '', label: t('common.selectOption') },
                      ...stayOptions,
                    ]}
                    onValueChange={(value) =>
                      screen.onObservationDraftChange('icu_stay_id', value)
                    }
                    compact
                    searchable
                  />
                  <TextField
                    label="Observed at"
                    value={screen.observationDraft.observed_at}
                    onChangeText={(value) =>
                      screen.onObservationDraftChange('observed_at', value)
                    }
                    type="datetime-local"
                    density="compact"
                  />
                  <TextArea
                    label="Observation"
                    value={screen.observationDraft.observation}
                    onChangeText={(value) =>
                      screen.onObservationDraftChange('observation', value)
                    }
                    rows={3}
                  />
                </StyledFieldRow>
                <StyledInlineActions>
                  <Button
                    variant="primary"
                    size="small"
                    onPress={screen.onAddIcuObservation}
                    disabled={
                      !screen.canMutate ||
                      !screen.actionMatrix.canAddIcuObservation
                    }
                  >
                    Save Observation
                  </Button>
                </StyledInlineActions>
              </Card>
            ) : null}

            {screen.isAlertFormOpen ? (
              <Card variant="outlined" testID="icu-workbench-alert-form">
                <StyledSectionTitle>Critical Alerts</StyledSectionTitle>
                <StyledFieldRow>
                  <Select
                    label="ICU stay"
                    value={screen.criticalAlertDraft.icu_stay_id}
                    options={[
                      { value: '', label: t('common.selectOption') },
                      ...stayOptions,
                    ]}
                    onValueChange={(value) =>
                      screen.onCriticalAlertDraftChange('icu_stay_id', value)
                    }
                    compact
                    searchable
                  />
                  <Select
                    label="Severity"
                    value={screen.criticalAlertDraft.severity}
                    options={criticalSeverityOptions.filter((row) => row.value)}
                    onValueChange={(value) =>
                      screen.onCriticalAlertDraftChange('severity', value)
                    }
                    compact
                  />
                  <TextArea
                    label="Alert message"
                    value={screen.criticalAlertDraft.message}
                    onChangeText={(value) =>
                      screen.onCriticalAlertDraftChange('message', value)
                    }
                    rows={3}
                  />
                  <Select
                    label="Resolve alert"
                    value={screen.resolveAlertDraft.critical_alert_id}
                    options={[
                      { value: '', label: t('common.selectOption') },
                      ...alertOptions,
                    ]}
                    onValueChange={screen.onResolveAlertDraftChange}
                    compact
                    searchable
                  />
                </StyledFieldRow>
                <StyledInlineActions>
                  <Button
                    variant="primary"
                    size="small"
                    onPress={screen.onAddCriticalAlert}
                    disabled={
                      !screen.canMutate ||
                      !screen.actionMatrix.canAddCriticalAlert
                    }
                  >
                    Raise Alert
                  </Button>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={screen.onResolveCriticalAlert}
                    disabled={
                      !screen.canMutate ||
                      !screen.actionMatrix.canResolveCriticalAlert
                    }
                  >
                    Resolve Alert
                  </Button>
                </StyledInlineActions>
              </Card>
            ) : null}

            <Card variant="outlined">
              <StyledInlineActions>
                <Text variant="caption">
                  {t('ipd.workbench.list.count', {
                    count: screen.flowList.length,
                  })}
                </Text>
                {screen.pagination?.total ? (
                  <Text variant="caption">
                    {t('ipd.workbench.list.total', {
                      total: screen.pagination.total,
                    })}
                  </Text>
                ) : null}
              </StyledInlineActions>
              {screen.flowList.length === 0 ? (
                <EmptyState
                  title="No ICU patients in queue"
                  description="Adjust filters or start an ICU stay from an active admission."
                  testID="icu-workbench-empty"
                />
              ) : (
                <StyledFlowList>
                  {screen.flowList.map((item, index) => {
                    const flowId =
                      item.display_id || item.human_friendly_id || item.id;
                    const isSelected =
                      String(screen.selectedFlowId || '').toUpperCase() ===
                      String(flowId || '').toUpperCase();
                    return (
                      <StyledFlowListItem
                        key={flowId || `icu-flow-${index + 1}`}
                        onPress={() => screen.onSelectFlow(item)}
                        $selected={isSelected}
                        accessibilityRole="button"
                        testID={`icu-workbench-list-item-${index + 1}`}
                      >
                        <StyledFlowTitleRow>
                          <StyledFlowTitle>
                            {item.patient_display_name ||
                              t('common.notAvailable')}
                          </StyledFlowTitle>
                          <Badge>
                            {item.stage || t('common.notAvailable')}
                          </Badge>
                        </StyledFlowTitleRow>
                        <StyledChipRow>
                          <Chip size="small">
                            ICU: {item.icu_status || 'NONE'}
                          </Chip>
                          {item.critical_severity ? (
                            <Chip size="small">
                              Severity: {item.critical_severity}
                            </Chip>
                          ) : null}
                        </StyledChipRow>
                        <StyledFlowMeta>{`Admission: ${
                          flowId || t('common.notAvailable')
                        }`}</StyledFlowMeta>
                        <StyledFlowMeta>{`ICU stay: ${
                          item.active_icu_stay_id ||
                          item.latest_icu_stay_id ||
                          t('common.notAvailable')
                        }`}</StyledFlowMeta>
                        <StyledFlowMeta>{`Ward: ${
                          item.ward_display_name || t('common.notAvailable')
                        }`}</StyledFlowMeta>
                      </StyledFlowListItem>
                    );
                  })}
                </StyledFlowList>
              )}
            </Card>
          </StyledPanel>

          <StyledPanel>
            <Card variant="outlined">
              <StyledInlineActions>
                <StyledSectionTitle>Patient Snapshot</StyledSectionTitle>
                {screen.isSelectedSnapshotLoading ? (
                  <Text variant="caption">{t('common.loading')}</Text>
                ) : null}
              </StyledInlineActions>
              {!screen.selectedFlow ? (
                <EmptyState
                  title={t('ipd.workbench.states.noSelectionTitle')}
                  description={t('ipd.workbench.states.noSelectionDescription')}
                />
              ) : (
                <StyledSnapshotGrid>
                  {renderSnapshotField(
                    t('ipd.workbench.snapshot.admissionId'),
                    screen.selectedSummary.admissionId,
                    t('common.notAvailable')
                  )}
                  {renderSnapshotField(
                    t('ipd.workbench.snapshot.patient'),
                    screen.selectedSummary.patientName,
                    t('common.notAvailable')
                  )}
                  {renderSnapshotField(
                    t('ipd.workbench.snapshot.patientId'),
                    screen.selectedSummary.patientId,
                    t('common.notAvailable')
                  )}
                  {renderSnapshotField(
                    t('ipd.workbench.snapshot.stage'),
                    screen.selectedSummary.stage,
                    t('common.notAvailable')
                  )}
                  {renderSnapshotField(
                    'ICU status',
                    screen.selectedSummary.icuStatus,
                    t('common.notAvailable')
                  )}
                  {renderSnapshotField(
                    'Active ICU stay',
                    screen.selectedSummary.activeIcuStayId,
                    t('common.notAvailable')
                  )}
                  {renderSnapshotField(
                    'Latest ICU stay',
                    screen.selectedSummary.latestIcuStayId,
                    t('common.notAvailable')
                  )}
                  {renderSnapshotField(
                    'Critical severity',
                    screen.selectedSummary.criticalSeverity,
                    t('common.notAvailable')
                  )}
                  {renderSnapshotField(
                    'Critical alerts',
                    String(screen.selectedSummary.criticalAlertCount || 0),
                    '0'
                  )}
                  {renderSnapshotField(
                    t('ipd.workbench.snapshot.activeBed'),
                    screen.selectedSummary.activeBed,
                    t('common.notAvailable')
                  )}
                  {renderSnapshotField(
                    t('ipd.workbench.snapshot.ward'),
                    screen.selectedSummary.activeWard,
                    t('common.notAvailable')
                  )}
                  {renderSnapshotField(
                    t('ipd.workbench.snapshot.transferStatus'),
                    screen.selectedSummary.transferStatus,
                    t('common.notAvailable')
                  )}
                </StyledSnapshotGrid>
              )}
            </Card>

            <Card variant="outlined">
              <StyledSectionTitle>
                {t('ipd.workbench.quickLinks.title')}
              </StyledSectionTitle>
              <StyledInlineActions>
                <Button
                  variant="surface"
                  size="small"
                  onPress={screen.onOpenPatientProfile}
                >
                  {t('ipd.workbench.quickLinks.patient')}
                </Button>
                <Button
                  variant="surface"
                  size="small"
                  onPress={screen.onOpenLabOrderCreate}
                >
                  {t('ipd.workbench.quickLinks.labOrder')}
                </Button>
                <Button
                  variant="surface"
                  size="small"
                  onPress={screen.onOpenRadiologyOrderCreate}
                >
                  {t('ipd.workbench.quickLinks.radiologyOrder')}
                </Button>
                <Button
                  variant="surface"
                  size="small"
                  onPress={screen.onOpenPharmacyOrderCreate}
                >
                  {t('ipd.workbench.quickLinks.pharmacyOrder')}
                </Button>
                <Button
                  variant="surface"
                  size="small"
                  onPress={screen.onOpenBillingInvoiceCreate}
                >
                  {t('ipd.workbench.quickLinks.invoice')}
                </Button>
              </StyledInlineActions>
            </Card>

            <Card variant="outlined">
              <Accordion
                title="Secondary IPD Actions"
                expanded={screen.isSecondaryActionsOpen}
                onChange={screen.setIsSecondaryActionsOpen}
                testID="icu-workbench-secondary-actions"
              >
                <StyledFieldRow>
                  <Select
                    label={t('ipd.workbench.actions.assignBed')}
                    value={screen.assignBedDraft.bed_id}
                    options={[
                      { value: '', label: t('common.selectOption') },
                      ...bedOptions,
                    ]}
                    onValueChange={screen.onAssignBedDraftChange}
                    searchable
                    compact
                  />
                  <StyledInlineActions>
                    <Button
                      variant="primary"
                      size="small"
                      onPress={screen.onAssignBed}
                      disabled={
                        !screen.canMutate || !screen.actionMatrix.canAssignBed
                      }
                    >
                      {t('ipd.workbench.actions.assignBed')}
                    </Button>
                    <Button
                      variant="surface"
                      size="small"
                      onPress={screen.onReleaseBed}
                      disabled={
                        !screen.canMutate || !screen.actionMatrix.canReleaseBed
                      }
                    >
                      {t('ipd.workbench.actions.releaseBed')}
                    </Button>
                  </StyledInlineActions>
                </StyledFieldRow>

                <StyledFieldRow>
                  <Select
                    label={t('ipd.workbench.actions.fromWard')}
                    value={screen.transferDraft.from_ward_id}
                    options={wardOptions}
                    onValueChange={(value) =>
                      screen.onTransferDraftChange('from_ward_id', value)
                    }
                    compact
                  />
                  <Select
                    label={t('ipd.workbench.actions.toWard')}
                    value={screen.transferDraft.to_ward_id}
                    options={wardOptions}
                    onValueChange={(value) =>
                      screen.onTransferDraftChange('to_ward_id', value)
                    }
                    compact
                  />
                  <Select
                    label={t('ipd.workbench.actions.transferAction')}
                    value={screen.transferDraft.action}
                    options={transferActionOptions}
                    onValueChange={(value) =>
                      screen.onTransferDraftChange('action', value)
                    }
                    compact
                  />
                  <Select
                    label={t('ipd.workbench.actions.transferBed')}
                    value={screen.transferDraft.to_bed_id}
                    options={[
                      { value: '', label: t('common.selectOption') },
                      ...bedOptions,
                    ]}
                    onValueChange={(value) =>
                      screen.onTransferDraftChange('to_bed_id', value)
                    }
                    compact
                    searchable
                  />
                  <TextField
                    label={t('ipd.workbench.actions.transferRequestId')}
                    value={screen.transferDraft.transfer_request_id}
                    onChangeText={(value) =>
                      screen.onTransferDraftChange('transfer_request_id', value)
                    }
                    density="compact"
                  />
                  <StyledInlineActions>
                    <Button
                      variant="surface"
                      size="small"
                      onPress={screen.onRequestTransfer}
                      disabled={
                        !screen.canMutate ||
                        !screen.actionMatrix.canRequestTransfer
                      }
                    >
                      {t('ipd.workbench.actions.requestTransfer')}
                    </Button>
                    <Button
                      variant="primary"
                      size="small"
                      onPress={screen.onUpdateTransfer}
                      disabled={
                        !screen.canMutate ||
                        !screen.actionMatrix.canUpdateTransfer
                      }
                    >
                      {t('ipd.workbench.actions.updateTransfer')}
                    </Button>
                  </StyledInlineActions>
                </StyledFieldRow>

                <StyledFieldRow>
                  <TextArea
                    label={t('ipd.workbench.actions.wardRoundNotes')}
                    value={screen.wardRoundDraft.notes}
                    onChangeText={(value) =>
                      screen.onWardRoundDraftChange('notes', value)
                    }
                    rows={3}
                  />
                  <TextField
                    label={t('ipd.workbench.actions.wardRoundAt')}
                    value={screen.wardRoundDraft.round_at}
                    onChangeText={(value) =>
                      screen.onWardRoundDraftChange('round_at', value)
                    }
                    type="datetime-local"
                    density="compact"
                  />
                  <Button
                    variant="surface"
                    size="small"
                    onPress={screen.onAddWardRound}
                    disabled={!screen.canMutate}
                  >
                    {t('ipd.workbench.actions.addWardRound')}
                  </Button>
                </StyledFieldRow>

                <StyledFieldRow>
                  <TextField
                    label={t('ipd.workbench.actions.nurseId')}
                    value={screen.nursingDraft.nurse_user_id}
                    onChangeText={(value) =>
                      screen.onNursingDraftChange('nurse_user_id', value)
                    }
                    density="compact"
                  />
                  <TextArea
                    label={t('ipd.workbench.actions.nursingNote')}
                    value={screen.nursingDraft.note}
                    onChangeText={(value) =>
                      screen.onNursingDraftChange('note', value)
                    }
                    rows={3}
                  />
                  <Button
                    variant="surface"
                    size="small"
                    onPress={screen.onAddNursingNote}
                    disabled={!screen.canMutate}
                  >
                    {t('ipd.workbench.actions.addNursingNote')}
                  </Button>
                </StyledFieldRow>

                <StyledFieldRow>
                  <TextField
                    label={t('ipd.workbench.actions.medicationDose')}
                    value={screen.medicationDraft.dose}
                    onChangeText={(value) =>
                      screen.onMedicationDraftChange('dose', value)
                    }
                    density="compact"
                  />
                  <TextField
                    label={t('ipd.workbench.actions.medicationUnit')}
                    value={screen.medicationDraft.unit}
                    onChangeText={(value) =>
                      screen.onMedicationDraftChange('unit', value)
                    }
                    density="compact"
                  />
                  <Select
                    label={t('ipd.workbench.actions.medicationRoute')}
                    value={screen.medicationDraft.route}
                    options={medicationRouteOptions}
                    onValueChange={(value) =>
                      screen.onMedicationDraftChange('route', value)
                    }
                    compact
                  />
                  <TextField
                    label={t('ipd.workbench.actions.medicationAt')}
                    value={screen.medicationDraft.administered_at}
                    onChangeText={(value) =>
                      screen.onMedicationDraftChange('administered_at', value)
                    }
                    type="datetime-local"
                    density="compact"
                  />
                  <Button
                    variant="surface"
                    size="small"
                    onPress={screen.onAddMedicationAdministration}
                    disabled={!screen.canMutate}
                  >
                    {t('ipd.workbench.actions.addMedication')}
                  </Button>
                </StyledFieldRow>

                <StyledFieldRow>
                  <TextArea
                    label={t('ipd.workbench.actions.dischargeSummary')}
                    value={screen.dischargeDraft.summary}
                    onChangeText={(value) =>
                      screen.onDischargeDraftChange('summary', value)
                    }
                    rows={4}
                  />
                  <TextField
                    label={t('ipd.workbench.actions.dischargeAt')}
                    value={screen.dischargeDraft.discharged_at}
                    onChangeText={(value) =>
                      screen.onDischargeDraftChange('discharged_at', value)
                    }
                    type="datetime-local"
                    density="compact"
                  />
                  <StyledInlineActions>
                    <Button
                      variant="surface"
                      size="small"
                      onPress={screen.onPlanDischarge}
                      disabled={
                        !screen.canMutate ||
                        !screen.actionMatrix.canPlanDischarge
                      }
                    >
                      {t('ipd.workbench.actions.planDischarge')}
                    </Button>
                    <Button
                      variant="primary"
                      size="small"
                      onPress={screen.onFinalizeDischarge}
                      disabled={
                        !screen.canMutate ||
                        !screen.actionMatrix.canFinalizeDischarge
                      }
                    >
                      {t('ipd.workbench.actions.finalizeDischarge')}
                    </Button>
                  </StyledInlineActions>
                </StyledFieldRow>
              </Accordion>
              {screen.formError ? (
                <StyledErrorText>{screen.formError}</StyledErrorText>
              ) : null}
            </Card>

            <Card variant="outlined">
              <StyledSectionTitle>
                {t('ipd.workbench.timeline.title')}
              </StyledSectionTitle>
              {screen.timelineItems.length === 0 ? (
                <EmptyState
                  title={t('ipd.workbench.timeline.emptyTitle')}
                  description={t('ipd.workbench.timeline.emptyDescription')}
                />
              ) : (
                <StyledTimeline>
                  {screen.timelineItems.map((entry) => (
                    <StyledTimelineItem
                      key={entry.id}
                    >{`${entry.label} | ${entry.timestamp}`}</StyledTimelineItem>
                  ))}
                </StyledTimeline>
              )}
            </Card>
          </StyledPanel>
        </StyledLayout>
      ) : null}
    </StyledContainer>
  );
};

export default IcuWorkbenchScreen;
