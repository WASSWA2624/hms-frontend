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
import useIpdWorkbenchScreen from './useIpdWorkbenchScreen';
import {
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
} from './IpdWorkbenchScreen.styles';

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

const IpdWorkbenchScreen = () => {
  const { t } = useI18n();
  const screen = useIpdWorkbenchScreen();
  const stageOptions = toSelectOptions(screen.stageOptions);
  const wardOptions = toSelectOptions(screen.wardOptions);
  const queueScopeOptions = toSelectOptions(screen.queueScopeOptions);
  const transferStatusOptions = toSelectOptions(screen.transferStatusOptions);
  const hasActiveBedOptions = toSelectOptions(screen.hasActiveBedOptions);
  const bedOptions = toSelectOptions(screen.bedOptions);
  const patientOptions = toSelectOptions(screen.startPatientOptions);
  const transferActionOptions = screen.transferActionOptions.map((value) => ({ value, label: value }));
  const medicationRouteOptions = screen.medicationRouteOptions.map((value) => ({ value, label: value }));

  return (
    <StyledContainer testID="ipd-workbench-screen">
      <StyledHeader>
        <StyledHeading>
          <StyledTitle>{t('ipd.workbench.title')}</StyledTitle>
          <StyledDescription>{t('ipd.workbench.description')}</StyledDescription>
        </StyledHeading>
        <Button variant="surface" size="small" onPress={screen.onRetry} icon={<Icon glyph={'\u21bb'} size="xs" decorative />} testID="ipd-workbench-refresh">
          {t('common.retry')}
        </Button>
      </StyledHeader>

      {screen.isLoading ? <LoadingSpinner accessibilityLabel={t('common.loading')} testID="ipd-workbench-loading" /> : null}
      {!screen.isLoading && !screen.canViewWorkbench ? <ErrorState size={ErrorStateSizes.SMALL} title={t('ipd.workbench.states.accessDeniedTitle')} description={t('ipd.workbench.states.accessDeniedDescription')} testID="ipd-workbench-access-denied" /> : null}
      {!screen.isLoading && screen.hasError ? <ErrorState size={ErrorStateSizes.SMALL} title={t('ipd.workbench.states.loadErrorTitle')} description={screen.errorCode || t('ipd.workbench.states.loadErrorDescription')} testID="ipd-workbench-error" /> : null}
      {!screen.isLoading ? <OfflineState size={OfflineStateSizes.SMALL} title={t('shell.banners.offline.title')} description={t('ipd.workbench.states.offlineNotice')} testID="ipd-workbench-offline" style={{ display: screen.isOffline ? 'block' : 'none' }} /> : null}

      {!screen.isLoading && screen.canViewWorkbench ? (
        <StyledLayout>
          <StyledPanel>
            <Card variant="outlined">
              <StyledSectionTitle>{t('ipd.workbench.list.title')}</StyledSectionTitle>
              <StyledFilterGrid>
                <TextField label={t('ipd.workbench.filters.search')} value={screen.searchText} onChangeText={screen.onFlowSearchChange} density="compact" testID="ipd-workbench-search" />
                <Select label={t('ipd.workbench.filters.queueScope')} value={screen.queueScope} options={queueScopeOptions} onValueChange={screen.onQueueScopeChange} compact />
                <Select label={t('ipd.workbench.filters.stage')} value={screen.stageFilter} options={stageOptions} onValueChange={screen.onStageFilterChange} compact />
                <Select label={t('ipd.workbench.filters.ward')} value={screen.wardFilter} options={wardOptions} onValueChange={screen.onWardFilterChange} compact />
                <Select label={t('ipd.workbench.filters.transfer')} value={screen.transferStatusFilter} options={transferStatusOptions} onValueChange={screen.onTransferStatusFilterChange} compact />
                <Select label={t('ipd.workbench.filters.bedState')} value={screen.hasActiveBedFilter} options={hasActiveBedOptions} onValueChange={screen.onHasActiveBedFilterChange} compact />
              </StyledFilterGrid>
              <StyledInlineActions>
                <Button variant="surface" size="small" onPress={screen.onClearFilters}>{t('ipd.workbench.filters.clear')}</Button>
                <Button variant="surface" size="small" onPress={() => screen.setIsStartFormOpen((previous) => !previous)} disabled={!screen.canMutate} icon={<Icon glyph="+" size="xs" decorative />}>
                  {t('ipd.workbench.actions.startAdmission')}
                </Button>
              </StyledInlineActions>
            </Card>

            {screen.isStartFormOpen ? (
              <Card variant="outlined" testID="ipd-workbench-start-form">
                <StyledSectionTitle>{t('ipd.workbench.start.title')}</StyledSectionTitle>
                <StyledFieldRow>
                  <TextField label={t('ipd.workbench.start.patientSearch')} value={screen.startPatientSearchText} onChangeText={screen.onStartPatientSearchChange} density="compact" />
                  <Select label={t('ipd.workbench.start.patientId')} value={screen.startDraft.patient_id} options={[{ value: '', label: t('common.selectOption') }, ...patientOptions]} onValueChange={screen.onStartPatientSelect} compact searchable />
                  <Button variant="surface" size="small" onPress={screen.onOpenCreatePatient}>{t('ipd.workbench.start.createPatient')}</Button>
                  <TextField label={t('ipd.workbench.start.encounterId')} value={screen.startDraft.encounter_id} onChangeText={(value) => screen.onStartDraftChange('encounter_id', value)} density="compact" />
                  <Select label={t('ipd.workbench.start.initialBed')} value={screen.startDraft.bed_id} options={[{ value: '', label: t('common.none') }, ...bedOptions]} onValueChange={(value) => screen.onStartDraftChange('bed_id', value)} compact searchable />
                  <TextField label={t('ipd.workbench.start.admittedAt')} value={screen.startDraft.admitted_at} onChangeText={(value) => screen.onStartDraftChange('admitted_at', value)} type="datetime-local" density="compact" />
                </StyledFieldRow>
                <StyledInlineActions>
                  <Button variant="primary" size="small" onPress={screen.onStartAdmission} disabled={!screen.canMutate} testID="ipd-workbench-start-submit">{t('ipd.workbench.actions.startAdmission')}</Button>
                </StyledInlineActions>
              </Card>
            ) : null}

            <Card variant="outlined">
              <StyledInlineActions>
                <Text variant="caption">{t('ipd.workbench.list.count', { count: screen.flowList.length })}</Text>
                {screen.pagination?.total ? <Text variant="caption">{t('ipd.workbench.list.total', { total: screen.pagination.total })}</Text> : null}
              </StyledInlineActions>
              {screen.flowList.length === 0 ? <EmptyState title={t('ipd.workbench.states.emptyTitle')} description={t('ipd.workbench.states.emptyDescription')} testID="ipd-workbench-empty" /> : (
                <StyledFlowList>
                  {screen.flowList.map((item, index) => {
                    const flowId = item.display_id || item.human_friendly_id || item.id;
                    const isSelected = String(screen.selectedFlowId || '').toUpperCase() === String(flowId || '').toUpperCase();
                    return (
                      <StyledFlowListItem key={flowId || `ipd-flow-${index + 1}`} onPress={() => screen.onSelectFlow(item)} $selected={isSelected} accessibilityRole="button" testID={`ipd-workbench-list-item-${index + 1}`}>
                        <StyledFlowTitleRow>
                          <StyledFlowTitle>{item.patient_display_name || t('common.notAvailable')}</StyledFlowTitle>
                          <Badge>{item.stage || t('common.notAvailable')}</Badge>
                        </StyledFlowTitleRow>
                        <StyledFlowMeta>{`${t('ipd.workbench.snapshot.admissionId')}: ${flowId || t('common.notAvailable')}`}</StyledFlowMeta>
                        <StyledFlowMeta>{`${t('ipd.workbench.snapshot.ward')}: ${item.ward_display_name || t('common.notAvailable')}`}</StyledFlowMeta>
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
                <StyledSectionTitle>{t('ipd.workbench.snapshot.title')}</StyledSectionTitle>
                {screen.isSelectedSnapshotLoading ? <Text variant="caption">{t('common.loading')}</Text> : null}
              </StyledInlineActions>
              {!screen.selectedFlow ? <EmptyState title={t('ipd.workbench.states.noSelectionTitle')} description={t('ipd.workbench.states.noSelectionDescription')} /> : (
                <StyledSnapshotGrid>
                  {renderSnapshotField(t('ipd.workbench.snapshot.admissionId'), screen.selectedSummary.admissionId, t('common.notAvailable'))}
                  {renderSnapshotField(t('ipd.workbench.snapshot.patient'), screen.selectedSummary.patientName, t('common.notAvailable'))}
                  {renderSnapshotField(t('ipd.workbench.snapshot.patientId'), screen.selectedSummary.patientId, t('common.notAvailable'))}
                  {renderSnapshotField(t('ipd.workbench.snapshot.stage'), screen.selectedSummary.stage, t('common.notAvailable'))}
                  {renderSnapshotField(t('ipd.workbench.snapshot.nextStep'), screen.selectedSummary.nextStep, t('common.notAvailable'))}
                  {renderSnapshotField(t('ipd.workbench.snapshot.activeBed'), screen.selectedSummary.activeBed, t('common.notAvailable'))}
                  {renderSnapshotField(t('ipd.workbench.snapshot.ward'), screen.selectedSummary.activeWard, t('common.notAvailable'))}
                  {renderSnapshotField(t('ipd.workbench.snapshot.transferStatus'), screen.selectedSummary.transferStatus, t('common.notAvailable'))}
                </StyledSnapshotGrid>
              )}
            </Card>

            <Card variant="outlined">
              <StyledSectionTitle>{t('ipd.workbench.quickLinks.title')}</StyledSectionTitle>
              <StyledInlineActions>
                <Button variant="surface" size="small" onPress={screen.onOpenPatientProfile}>{t('ipd.workbench.quickLinks.patient')}</Button>
                <Button variant="surface" size="small" onPress={screen.onOpenLabOrderCreate}>{t('ipd.workbench.quickLinks.labOrder')}</Button>
                <Button variant="surface" size="small" onPress={screen.onOpenRadiologyOrderCreate}>{t('ipd.workbench.quickLinks.radiologyOrder')}</Button>
                <Button variant="surface" size="small" onPress={screen.onOpenPharmacyOrderCreate}>{t('ipd.workbench.quickLinks.pharmacyOrder')}</Button>
                <Button variant="surface" size="small" onPress={screen.onOpenBillingInvoiceCreate}>{t('ipd.workbench.quickLinks.invoice')}</Button>
              </StyledInlineActions>
            </Card>

            <Card variant="outlined">
              <StyledSectionTitle>{t('ipd.workbench.actions.title')}</StyledSectionTitle>

              <StyledFieldRow>
                <Select label={t('ipd.workbench.actions.assignBed')} value={screen.assignBedDraft.bed_id} options={[{ value: '', label: t('common.selectOption') }, ...bedOptions]} onValueChange={screen.onAssignBedDraftChange} searchable compact />
                <StyledInlineActions>
                  <Button variant="primary" size="small" onPress={screen.onAssignBed} disabled={!screen.canMutate || !screen.actionMatrix.canAssignBed}>{t('ipd.workbench.actions.assignBed')}</Button>
                  <Button variant="surface" size="small" onPress={screen.onReleaseBed} disabled={!screen.canMutate || !screen.actionMatrix.canReleaseBed}>{t('ipd.workbench.actions.releaseBed')}</Button>
                </StyledInlineActions>
              </StyledFieldRow>

              <StyledFieldRow>
                <Select label={t('ipd.workbench.actions.fromWard')} value={screen.transferDraft.from_ward_id} options={wardOptions} onValueChange={(value) => screen.onTransferDraftChange('from_ward_id', value)} compact />
                <Select label={t('ipd.workbench.actions.toWard')} value={screen.transferDraft.to_ward_id} options={wardOptions} onValueChange={(value) => screen.onTransferDraftChange('to_ward_id', value)} compact />
                <Select label={t('ipd.workbench.actions.transferAction')} value={screen.transferDraft.action} options={transferActionOptions} onValueChange={(value) => screen.onTransferDraftChange('action', value)} compact />
                <Select label={t('ipd.workbench.actions.transferBed')} value={screen.transferDraft.to_bed_id} options={[{ value: '', label: t('common.selectOption') }, ...bedOptions]} onValueChange={(value) => screen.onTransferDraftChange('to_bed_id', value)} compact searchable />
                <TextField label={t('ipd.workbench.actions.transferRequestId')} value={screen.transferDraft.transfer_request_id} onChangeText={(value) => screen.onTransferDraftChange('transfer_request_id', value)} density="compact" />
                <StyledInlineActions>
                  <Button variant="surface" size="small" onPress={screen.onRequestTransfer} disabled={!screen.canMutate || !screen.actionMatrix.canRequestTransfer}>{t('ipd.workbench.actions.requestTransfer')}</Button>
                  <Button variant="primary" size="small" onPress={screen.onUpdateTransfer} disabled={!screen.canMutate || !screen.actionMatrix.canUpdateTransfer}>{t('ipd.workbench.actions.updateTransfer')}</Button>
                </StyledInlineActions>
              </StyledFieldRow>

              <StyledFieldRow>
                <TextArea label={t('ipd.workbench.actions.wardRoundNotes')} value={screen.wardRoundDraft.notes} onChangeText={(value) => screen.onWardRoundDraftChange('notes', value)} rows={3} />
                <TextField label={t('ipd.workbench.actions.wardRoundAt')} value={screen.wardRoundDraft.round_at} onChangeText={(value) => screen.onWardRoundDraftChange('round_at', value)} type="datetime-local" density="compact" />
                <Button variant="surface" size="small" onPress={screen.onAddWardRound} disabled={!screen.canMutate}>{t('ipd.workbench.actions.addWardRound')}</Button>
              </StyledFieldRow>

              <StyledFieldRow>
                <TextField label={t('ipd.workbench.actions.nurseId')} value={screen.nursingDraft.nurse_user_id} onChangeText={(value) => screen.onNursingDraftChange('nurse_user_id', value)} density="compact" />
                <TextArea label={t('ipd.workbench.actions.nursingNote')} value={screen.nursingDraft.note} onChangeText={(value) => screen.onNursingDraftChange('note', value)} rows={3} />
                <Button variant="surface" size="small" onPress={screen.onAddNursingNote} disabled={!screen.canMutate}>{t('ipd.workbench.actions.addNursingNote')}</Button>
              </StyledFieldRow>

              <StyledFieldRow>
                <TextField label={t('ipd.workbench.actions.medicationDose')} value={screen.medicationDraft.dose} onChangeText={(value) => screen.onMedicationDraftChange('dose', value)} density="compact" />
                <TextField label={t('ipd.workbench.actions.medicationUnit')} value={screen.medicationDraft.unit} onChangeText={(value) => screen.onMedicationDraftChange('unit', value)} density="compact" />
                <Select label={t('ipd.workbench.actions.medicationRoute')} value={screen.medicationDraft.route} options={medicationRouteOptions} onValueChange={(value) => screen.onMedicationDraftChange('route', value)} compact />
                <TextField label={t('ipd.workbench.actions.medicationAt')} value={screen.medicationDraft.administered_at} onChangeText={(value) => screen.onMedicationDraftChange('administered_at', value)} type="datetime-local" density="compact" />
                <Button variant="surface" size="small" onPress={screen.onAddMedicationAdministration} disabled={!screen.canMutate}>{t('ipd.workbench.actions.addMedication')}</Button>
              </StyledFieldRow>

              <StyledFieldRow>
                <TextArea label={t('ipd.workbench.actions.dischargeSummary')} value={screen.dischargeDraft.summary} onChangeText={(value) => screen.onDischargeDraftChange('summary', value)} rows={4} />
                <TextField label={t('ipd.workbench.actions.dischargeAt')} value={screen.dischargeDraft.discharged_at} onChangeText={(value) => screen.onDischargeDraftChange('discharged_at', value)} type="datetime-local" density="compact" />
                <StyledInlineActions>
                  <Button variant="surface" size="small" onPress={screen.onPlanDischarge} disabled={!screen.canMutate || !screen.actionMatrix.canPlanDischarge}>{t('ipd.workbench.actions.planDischarge')}</Button>
                  <Button variant="primary" size="small" onPress={screen.onFinalizeDischarge} disabled={!screen.canMutate || !screen.actionMatrix.canFinalizeDischarge}>{t('ipd.workbench.actions.finalizeDischarge')}</Button>
                </StyledInlineActions>
              </StyledFieldRow>

              {screen.formError ? <StyledErrorText>{screen.formError}</StyledErrorText> : null}
            </Card>

            <Card variant="outlined">
              <StyledSectionTitle>{t('ipd.workbench.timeline.title')}</StyledSectionTitle>
              {screen.timelineItems.length === 0 ? <EmptyState title={t('ipd.workbench.timeline.emptyTitle')} description={t('ipd.workbench.timeline.emptyDescription')} /> : (
                <StyledTimeline>
                  {screen.timelineItems.map((entry) => (
                    <StyledTimelineItem key={entry.id}>{`${entry.label} | ${entry.timestamp}`}</StyledTimelineItem>
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

export default IpdWorkbenchScreen;
