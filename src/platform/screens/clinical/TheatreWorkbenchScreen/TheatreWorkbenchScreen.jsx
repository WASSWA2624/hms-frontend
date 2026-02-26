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
import useTheatreWorkbenchScreen from './useTheatreWorkbenchScreen';
import {
  StyledContainer,
  StyledDescription,
  StyledErrorText,
  StyledFieldRow,
  StyledFilterGrid,
  StyledFlowList,
  StyledFlowListItem,
  StyledFlowHeading,
  StyledFlowOrder,
  StyledFlowHeadingText,
  StyledFlowCaseId,
  StyledFlowMetaCard,
  StyledFlowMetaGrid,
  StyledFlowMetaLabel,
  StyledFlowMetaValue,
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
  StyledTabRow,
  StyledTimeline,
  StyledTimelineItem,
  StyledTitle,
} from './TheatreWorkbenchScreen.styles';

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

const panelLabel = (value) =>
  String(value || '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());

const boolOptions = [
  { value: 'true', label: 'Checked' },
  { value: 'false', label: 'Unchecked' },
];

const toDateTimeLabel = (value, fallback) => {
  const text = String(value || '').trim();
  if (!text) return fallback;
  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) return text;
  return parsed.toLocaleString();
};

const TheatreWorkbenchScreen = () => {
  const { t } = useI18n();
  const screen = useTheatreWorkbenchScreen();

  const queueScopeOptions = toSelectOptions(screen.queueScopeOptions);
  const stageOptions = toSelectOptions(screen.stageOptions);
  const statusOptions = toSelectOptions(screen.statusOptions);
  const recordStatusOptions = toSelectOptions(screen.recordStatusOptions);
  const finalizedOptions = toSelectOptions(screen.finalizedOptions);
  const checklistPhaseOptions = toSelectOptions(screen.checklistPhaseOptions);
  const resourceTypeOptions = toSelectOptions(screen.resourceTypeOptions);
  const staffRoleOptions = toSelectOptions(screen.staffRoleOptions);
  const recordTypeOptions = toSelectOptions(screen.recordTypeOptions);
  const roomOptions = toSelectOptions(screen.roomOptions);
  const staffOptions = toSelectOptions(screen.staffOptions);
  const equipmentOptions = toSelectOptions(screen.equipmentOptions);
  const encounterOptions = toSelectOptions(screen.encounterOptions);
  const activeResourceOptions = toSelectOptions(screen.activeResourceOptions);

  const selectedFlow = screen.selectedFlow;

  return (
    <StyledContainer testID="theatre-workbench-screen">
      <StyledHeader>
        <StyledHeading>
          <StyledTitle>Theatre Workbench</StyledTitle>
          <StyledDescription>
            Unified theatre operations workspace for case progress, anesthesia,
            resources, post-op notes, and clinical timeline.
          </StyledDescription>
        </StyledHeading>
        <Button
          variant="surface"
          size="small"
          onPress={screen.onRetry}
          icon={<Icon glyph={'\u21bb'} size="xs" decorative />}
          testID="theatre-workbench-refresh"
        >
          {t('common.retry')}
        </Button>
      </StyledHeader>

      {screen.isLoading ? (
        <LoadingSpinner
          accessibilityLabel={t('common.loading')}
          testID="theatre-workbench-loading"
        />
      ) : null}

      {!screen.isLoading && !screen.canViewWorkbench ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title="Access denied"
          description="You do not have access to the theatre workspace."
          testID="theatre-workbench-access-denied"
        />
      ) : null}

      {!screen.isLoading && screen.hasError ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title="Unable to load theatre workspace"
          description={screen.errorCode || 'Please retry in a moment.'}
          testID="theatre-workbench-error"
        />
      ) : null}

      {!screen.isLoading ? (
        <OfflineState
          size={OfflineStateSizes.SMALL}
          title={t('shell.banners.offline.title')}
          description="Offline mode: theatre updates are limited."
          testID="theatre-workbench-offline"
          style={{ display: screen.isOffline ? 'block' : 'none' }}
        />
      ) : null}

      {!screen.isLoading && screen.canViewWorkbench ? (
        <StyledLayout>
          <StyledPanel>
            <Card variant="outlined">
              <StyledSectionTitle>Theatre Queue</StyledSectionTitle>
              <StyledFilterGrid>
                <TextField
                  label="Search"
                  value={screen.searchText}
                  onChangeText={screen.onSearchChange}
                  density="compact"
                  type="search"
                  testID="theatre-workbench-search"
                />
                <Select
                  label="Queue scope"
                  value={screen.queueScope}
                  options={queueScopeOptions}
                  onValueChange={screen.onQueueScopeChange}
                  compact
                />
                <Select
                  label="Stage"
                  value={screen.stageFilter}
                  options={stageOptions}
                  onValueChange={screen.onStageFilterChange}
                  compact
                />
                <Select
                  label="Status"
                  value={screen.statusFilter}
                  options={statusOptions}
                  onValueChange={screen.onStatusFilterChange}
                  compact
                />
                <Select
                  label="Room"
                  value={screen.roomFilter}
                  options={[
                    { value: '', label: t('common.all') },
                    ...roomOptions,
                  ]}
                  onValueChange={screen.onRoomFilterChange}
                  compact
                  searchable
                />
                <Select
                  label="Anesthesia"
                  value={screen.anesthesiaStatusFilter}
                  options={recordStatusOptions}
                  onValueChange={screen.onAnesthesiaStatusFilterChange}
                  compact
                />
                <Select
                  label="Post-op"
                  value={screen.postOpStatusFilter}
                  options={recordStatusOptions}
                  onValueChange={screen.onPostOpStatusFilterChange}
                  compact
                />
                <Select
                  label="Finalization"
                  value={screen.finalizedFilter}
                  options={finalizedOptions}
                  onValueChange={screen.onFinalizedFilterChange}
                  compact
                />
              </StyledFilterGrid>
              <StyledInlineActions>
                <Button
                  variant="surface"
                  size="small"
                  onPress={screen.onClearFilters}
                >
                  Clear
                </Button>
                <Button
                  variant="surface"
                  size="small"
                  onPress={() =>
                    screen.setIsStartFormOpen(!screen.isStartFormOpen)
                  }
                  disabled={!screen.canMutate}
                  icon={<Icon glyph="+" size="xs" decorative />}
                  testID="theatre-workbench-toggle-start-form"
                >
                  Start Case
                </Button>
              </StyledInlineActions>
            </Card>

            {screen.isStartFormOpen ? (
              <Card variant="outlined" testID="theatre-workbench-start-form">
                <StyledSectionTitle>Start Theatre Case</StyledSectionTitle>
                <StyledFieldRow>
                  <TextField
                    label="Encounter Search"
                    value={screen.encounterSearchText}
                    onChangeText={screen.onEncounterSearchChange}
                    density="compact"
                  />
                  <Select
                    label="Encounter"
                    value={screen.startDraft.encounter_id}
                    options={[
                      { value: '', label: t('common.selectOption') },
                      ...encounterOptions,
                    ]}
                    onValueChange={(value) =>
                      screen.onStartDraftChange('encounter_id', value)
                    }
                    compact
                    searchable
                  />
                  <TextField
                    label="Scheduled At"
                    value={screen.startDraft.scheduled_at}
                    onChangeText={(value) =>
                      screen.onStartDraftChange('scheduled_at', value)
                    }
                    type="datetime-local"
                    density="compact"
                  />
                  <Select
                    label="Status"
                    value={screen.startDraft.status}
                    options={statusOptions.filter((row) => row.value)}
                    onValueChange={(value) =>
                      screen.onStartDraftChange('status', value)
                    }
                    compact
                  />
                  <Select
                    label="Initial Stage"
                    value={screen.startDraft.workflow_stage}
                    options={stageOptions.filter((row) => row.value)}
                    onValueChange={(value) =>
                      screen.onStartDraftChange('workflow_stage', value)
                    }
                    compact
                  />
                  <Select
                    label="Room"
                    value={screen.startDraft.room_id}
                    options={[
                      { value: '', label: t('common.none') },
                      ...roomOptions,
                    ]}
                    onValueChange={(value) =>
                      screen.onStartDraftChange('room_id', value)
                    }
                    compact
                    searchable
                  />
                  <Select
                    label="Surgeon"
                    value={screen.startDraft.surgeon_user_id}
                    options={[
                      { value: '', label: t('common.none') },
                      ...staffOptions,
                    ]}
                    onValueChange={(value) =>
                      screen.onStartDraftChange('surgeon_user_id', value)
                    }
                    compact
                    searchable
                  />
                  <Select
                    label="Anesthetist"
                    value={screen.startDraft.anesthetist_user_id}
                    options={[
                      { value: '', label: t('common.none') },
                      ...staffOptions,
                    ]}
                    onValueChange={(value) =>
                      screen.onStartDraftChange('anesthetist_user_id', value)
                    }
                    compact
                    searchable
                  />
                  <TextArea
                    label="Notes"
                    value={screen.startDraft.stage_notes}
                    onChangeText={(value) =>
                      screen.onStartDraftChange('stage_notes', value)
                    }
                    rows={3}
                  />
                </StyledFieldRow>
                <StyledInlineActions>
                  <Button
                    variant="primary"
                    size="small"
                    onPress={screen.onStartCase}
                    disabled={!screen.canMutate}
                    testID="theatre-workbench-start-submit"
                  >
                    Start Case
                  </Button>
                </StyledInlineActions>
              </Card>
            ) : null}

            <Card variant="outlined">
              <StyledInlineActions>
                <Text variant="caption">{`Cases in view: ${screen.flowList.length}`}</Text>
                {screen.pagination?.total ? (
                  <Text variant="caption">{`Total: ${screen.pagination.total}`}</Text>
                ) : null}
              </StyledInlineActions>
              {screen.flowList.length === 0 ? (
                <EmptyState
                  title="No theatre cases found"
                  description="Adjust filters or start a new case."
                  testID="theatre-workbench-empty"
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
                        key={flowId || `theatre-flow-${index + 1}`}
                        onPress={() => screen.onSelectFlow(item)}
                        $selected={isSelected}
                        accessibilityRole="button"
                        testID={`theatre-workbench-list-item-${index + 1}`}
                      >
                        <StyledFlowTitleRow>
                          <StyledFlowHeading>
                            <StyledFlowOrder>{index + 1}</StyledFlowOrder>
                            <StyledFlowHeadingText>
                              <StyledFlowTitle>
                                {item.patient_display_name ||
                                  t('common.notAvailable')}
                              </StyledFlowTitle>
                              <StyledFlowCaseId>
                                {flowId || t('common.notAvailable')}
                              </StyledFlowCaseId>
                            </StyledFlowHeadingText>
                          </StyledFlowHeading>
                          <Badge>
                            {item.stage || t('common.notAvailable')}
                          </Badge>
                        </StyledFlowTitleRow>
                        <StyledFlowMetaGrid>
                          <StyledFlowMetaCard>
                            <StyledFlowMetaLabel>Status</StyledFlowMetaLabel>
                            <StyledFlowMetaValue>
                              {item.status || t('common.notAvailable')}
                            </StyledFlowMetaValue>
                          </StyledFlowMetaCard>
                          <StyledFlowMetaCard>
                            <StyledFlowMetaLabel>Room</StyledFlowMetaLabel>
                            <StyledFlowMetaValue>
                              {item.room_display_label ||
                                item.room_display_id ||
                                t('common.notAvailable')}
                            </StyledFlowMetaValue>
                          </StyledFlowMetaCard>
                          <StyledFlowMetaCard>
                            <StyledFlowMetaLabel>Encounter</StyledFlowMetaLabel>
                            <StyledFlowMetaValue>
                              {item.encounter_display_id ||
                                t('common.notAvailable')}
                            </StyledFlowMetaValue>
                          </StyledFlowMetaCard>
                          <StyledFlowMetaCard>
                            <StyledFlowMetaLabel>Scheduled</StyledFlowMetaLabel>
                            <StyledFlowMetaValue>
                              {toDateTimeLabel(
                                item.scheduled_at,
                                t('common.notAvailable')
                              )}
                            </StyledFlowMetaValue>
                          </StyledFlowMetaCard>
                        </StyledFlowMetaGrid>
                        <StyledFlowMeta>{`Patient ID: ${
                          item.patient_display_id || t('common.notAvailable')
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
                <StyledSectionTitle>Case Snapshot</StyledSectionTitle>
                {screen.isSelectedSnapshotLoading ? (
                  <Text variant="caption">{t('common.loading')}</Text>
                ) : null}
              </StyledInlineActions>
              {!selectedFlow ? (
                <EmptyState
                  title="No case selected"
                  description="Select a case from the queue to continue."
                />
              ) : (
                <StyledSnapshotGrid>
                  {renderSnapshotField(
                    'Case ID',
                    screen.selectedSummary.caseId,
                    t('common.notAvailable')
                  )}
                  {renderSnapshotField(
                    'Patient',
                    screen.selectedSummary.patientName,
                    t('common.notAvailable')
                  )}
                  {renderSnapshotField(
                    'Patient ID',
                    screen.selectedSummary.patientId,
                    t('common.notAvailable')
                  )}
                  {renderSnapshotField(
                    'Encounter ID',
                    screen.selectedSummary.encounterId,
                    t('common.notAvailable')
                  )}
                  {renderSnapshotField(
                    'Stage',
                    screen.selectedSummary.stage,
                    t('common.notAvailable')
                  )}
                  {renderSnapshotField(
                    'Status',
                    screen.selectedSummary.status,
                    t('common.notAvailable')
                  )}
                  {renderSnapshotField(
                    'Room',
                    screen.selectedSummary.room,
                    t('common.notAvailable')
                  )}
                  {renderSnapshotField(
                    'Checklist',
                    screen.selectedSummary.checklistProgress,
                    '0/0'
                  )}
                </StyledSnapshotGrid>
              )}
            </Card>

            <Card variant="outlined">
              <StyledSectionTitle>Quick Links</StyledSectionTitle>
              <StyledInlineActions>
                <Button
                  variant="surface"
                  size="small"
                  onPress={screen.onOpenPatientProfile}
                >
                  Patient
                </Button>
                <Button
                  variant="surface"
                  size="small"
                  onPress={screen.onOpenSchedulingAppointments}
                >
                  Scheduling
                </Button>
                <Button
                  variant="surface"
                  size="small"
                  onPress={screen.onOpenSchedulingQueues}
                >
                  Visit Queues
                </Button>
                <Button
                  variant="surface"
                  size="small"
                  onPress={screen.onOpenRoomSettings}
                >
                  Rooms
                </Button>
                <Button
                  variant="surface"
                  size="small"
                  onPress={screen.onOpenStaffAssignments}
                >
                  Staff
                </Button>
                <Button
                  variant="surface"
                  size="small"
                  onPress={screen.onOpenEquipmentRegistries}
                >
                  Equipment
                </Button>
              </StyledInlineActions>
            </Card>

            <Card variant="outlined">
              <StyledInlineActions>
                <StyledSectionTitle>Actions</StyledSectionTitle>
                {!selectedFlow ? (
                  <Text variant="caption">Select a case.</Text>
                ) : null}
              </StyledInlineActions>

              <StyledTabRow>
                {screen.panelOptions.map((panel) => (
                  <Button
                    key={panel}
                    variant={
                      screen.activePanel === panel ? 'primary' : 'surface'
                    }
                    size="small"
                    onPress={() => screen.setActivePanel(panel)}
                    disabled={!selectedFlow}
                  >
                    {panelLabel(panel)}
                  </Button>
                ))}
              </StyledTabRow>

              {screen.activePanel === 'snapshot' ? (
                <StyledFieldRow>
                  <Select
                    label="Stage"
                    value={screen.stageDraft.workflow_stage}
                    options={stageOptions.filter((row) => row.value)}
                    onValueChange={(value) =>
                      screen.onStageDraftChange('workflow_stage', value)
                    }
                    compact
                  />
                  <Select
                    label="Status"
                    value={screen.stageDraft.status}
                    options={statusOptions.filter((row) => row.value)}
                    onValueChange={(value) =>
                      screen.onStageDraftChange('status', value)
                    }
                    compact
                  />
                  <TextArea
                    label="Stage Notes"
                    value={screen.stageDraft.stage_notes}
                    onChangeText={(value) =>
                      screen.onStageDraftChange('stage_notes', value)
                    }
                    rows={3}
                  />
                  <Button
                    variant="primary"
                    size="small"
                    onPress={screen.onUpdateStage}
                    disabled={!screen.canMutate || !selectedFlow}
                  >
                    Update Stage
                  </Button>
                </StyledFieldRow>
              ) : null}

              {screen.activePanel === 'checklist' ? (
                <StyledFieldRow>
                  <Select
                    label="Phase"
                    value={screen.checklistDraft.phase}
                    options={checklistPhaseOptions}
                    onValueChange={(value) =>
                      screen.onChecklistDraftChange('phase', value)
                    }
                    compact
                  />
                  <TextField
                    label="Item Code"
                    value={screen.checklistDraft.item_code}
                    onChangeText={(value) =>
                      screen.onChecklistDraftChange('item_code', value)
                    }
                    density="compact"
                  />
                  <TextField
                    label="Item Label"
                    value={screen.checklistDraft.item_label}
                    onChangeText={(value) =>
                      screen.onChecklistDraftChange('item_label', value)
                    }
                    density="compact"
                  />
                  <Select
                    label="State"
                    value={screen.checklistDraft.is_checked ? 'true' : 'false'}
                    options={boolOptions}
                    onValueChange={(value) =>
                      screen.onChecklistDraftChange(
                        'is_checked',
                        String(value) === 'true'
                      )
                    }
                    compact
                  />
                  <TextArea
                    label="Notes"
                    value={screen.checklistDraft.notes}
                    onChangeText={(value) =>
                      screen.onChecklistDraftChange('notes', value)
                    }
                    rows={3}
                  />
                  <Button
                    variant="primary"
                    size="small"
                    onPress={screen.onToggleChecklistItem}
                    disabled={!screen.canMutate || !selectedFlow}
                  >
                    Save Checklist
                  </Button>
                </StyledFieldRow>
              ) : null}

              {screen.activePanel === 'anesthesia' ? (
                <StyledFieldRow>
                  <TextField
                    label="Record ID"
                    value={screen.anesthesiaDraft.anesthesia_record_id}
                    onChangeText={(value) =>
                      screen.onAnesthesiaDraftChange(
                        'anesthesia_record_id',
                        value
                      )
                    }
                    density="compact"
                  />
                  <Select
                    label="Anesthetist"
                    value={screen.anesthesiaDraft.anesthetist_user_id}
                    options={[
                      { value: '', label: t('common.selectOption') },
                      ...staffOptions,
                    ]}
                    onValueChange={(value) =>
                      screen.onAnesthesiaDraftChange(
                        'anesthetist_user_id',
                        value
                      )
                    }
                    compact
                    searchable
                  />
                  <Select
                    label="Record Status"
                    value={screen.anesthesiaDraft.record_status}
                    options={recordStatusOptions.filter((row) => row.value)}
                    onValueChange={(value) =>
                      screen.onAnesthesiaDraftChange('record_status', value)
                    }
                    compact
                  />
                  <TextArea
                    label="Notes"
                    value={screen.anesthesiaDraft.notes}
                    onChangeText={(value) =>
                      screen.onAnesthesiaDraftChange('notes', value)
                    }
                    rows={3}
                  />
                  <Button
                    variant="primary"
                    size="small"
                    onPress={screen.onUpsertAnesthesiaRecord}
                    disabled={!screen.canMutate || !selectedFlow}
                  >
                    Save Anesthesia
                  </Button>
                  <TextField
                    label="Observed At"
                    value={screen.observationDraft.observed_at}
                    onChangeText={(value) =>
                      screen.onObservationDraftChange('observed_at', value)
                    }
                    type="datetime-local"
                    density="compact"
                  />
                  <TextField
                    label="Observation Type"
                    value={screen.observationDraft.observation_type}
                    onChangeText={(value) =>
                      screen.onObservationDraftChange('observation_type', value)
                    }
                    density="compact"
                  />
                  <TextArea
                    label="Observation Notes"
                    value={screen.observationDraft.notes}
                    onChangeText={(value) =>
                      screen.onObservationDraftChange('notes', value)
                    }
                    rows={3}
                  />
                  <Button
                    variant="surface"
                    size="small"
                    onPress={screen.onAddAnesthesiaObservation}
                    disabled={!screen.canMutate || !selectedFlow}
                  >
                    Add Observation
                  </Button>
                </StyledFieldRow>
              ) : null}

              {screen.activePanel === 'resources' ? (
                <StyledFieldRow>
                  <Select
                    label="Type"
                    value={screen.assignResourceDraft.resource_type}
                    options={resourceTypeOptions}
                    onValueChange={(value) =>
                      screen.onAssignResourceDraftChange('resource_type', value)
                    }
                    compact
                  />
                  {screen.assignResourceDraft.resource_type === 'STAFF' ? (
                    <Select
                      label="Staff Role"
                      value={screen.assignResourceDraft.staff_role}
                      options={staffRoleOptions}
                      onValueChange={(value) =>
                        screen.onAssignResourceDraftChange('staff_role', value)
                      }
                      compact
                    />
                  ) : null}
                  <Select
                    label="Resource"
                    value={screen.assignResourceDraft.resource_id}
                    options={[
                      { value: '', label: t('common.selectOption') },
                      ...activeResourceOptions,
                    ]}
                    onValueChange={(value) =>
                      screen.onAssignResourceDraftChange('resource_id', value)
                    }
                    compact
                    searchable
                  />
                  <TextArea
                    label="Assignment Notes"
                    value={screen.assignResourceDraft.notes}
                    onChangeText={(value) =>
                      screen.onAssignResourceDraftChange('notes', value)
                    }
                    rows={3}
                  />
                  <Button
                    variant="primary"
                    size="small"
                    onPress={screen.onAssignResource}
                    disabled={!screen.canMutate || !selectedFlow}
                  >
                    Assign
                  </Button>
                  <TextField
                    label="Allocation ID"
                    value={screen.releaseResourceDraft.allocation_id}
                    onChangeText={(value) =>
                      screen.onReleaseResourceDraftChange(
                        'allocation_id',
                        value
                      )
                    }
                    density="compact"
                  />
                  <Select
                    label="Resource ID"
                    value={screen.releaseResourceDraft.resource_id}
                    options={[
                      { value: '', label: t('common.selectOption') },
                      ...roomOptions,
                      ...staffOptions,
                      ...equipmentOptions,
                    ]}
                    onValueChange={(value) =>
                      screen.onReleaseResourceDraftChange('resource_id', value)
                    }
                    compact
                    searchable
                  />
                  <Button
                    variant="surface"
                    size="small"
                    onPress={screen.onReleaseResource}
                    disabled={!screen.canMutate || !selectedFlow}
                  >
                    Release
                  </Button>
                </StyledFieldRow>
              ) : null}

              {screen.activePanel === 'post-op' ? (
                <StyledFieldRow>
                  <TextField
                    label="Post-op Note ID"
                    value={screen.postOpDraft.post_op_note_id}
                    onChangeText={(value) =>
                      screen.onPostOpDraftChange('post_op_note_id', value)
                    }
                    density="compact"
                  />
                  <Select
                    label="Record Status"
                    value={screen.postOpDraft.record_status}
                    options={recordStatusOptions.filter((row) => row.value)}
                    onValueChange={(value) =>
                      screen.onPostOpDraftChange('record_status', value)
                    }
                    compact
                  />
                  <TextArea
                    label="Post-op Note"
                    value={screen.postOpDraft.note}
                    onChangeText={(value) =>
                      screen.onPostOpDraftChange('note', value)
                    }
                    rows={4}
                  />
                  <Button
                    variant="primary"
                    size="small"
                    onPress={screen.onUpsertPostOpNote}
                    disabled={!screen.canMutate || !selectedFlow}
                  >
                    Save Post-op
                  </Button>
                </StyledFieldRow>
              ) : null}

              {screen.activePanel === 'timeline' ? (
                screen.timelineItems.length === 0 ? (
                  <EmptyState
                    title="No timeline events"
                    description="Events appear as case actions are captured."
                  />
                ) : (
                  <StyledTimeline>
                    {screen.timelineItems.map((entry) => (
                      <StyledTimelineItem
                        key={entry.id}
                      >{`${entry.label} | ${entry.timestamp}`}</StyledTimelineItem>
                    ))}
                  </StyledTimeline>
                )
              ) : null}

              <StyledFieldRow>
                <Select
                  label="Finalize Type"
                  value={screen.finalizeDraft.record_type}
                  options={recordTypeOptions}
                  onValueChange={(value) =>
                    screen.onFinalizeDraftChange('record_type', value)
                  }
                  compact
                />
                <Button
                  variant="primary"
                  size="small"
                  onPress={screen.onFinalizeRecord}
                  disabled={!screen.canMutate || !selectedFlow}
                >
                  Finalize
                </Button>
                <Select
                  label="Reopen Type"
                  value={screen.reopenDraft.record_type}
                  options={recordTypeOptions}
                  onValueChange={(value) =>
                    screen.onReopenDraftChange('record_type', value)
                  }
                  compact
                />
                <TextArea
                  label="Reopen Reason"
                  value={screen.reopenDraft.reason}
                  onChangeText={(value) =>
                    screen.onReopenDraftChange('reason', value)
                  }
                  rows={3}
                />
                <Button
                  variant="surface"
                  size="small"
                  onPress={screen.onReopenRecord}
                  disabled={!screen.canMutate || !selectedFlow}
                >
                  Reopen
                </Button>
              </StyledFieldRow>

              {screen.formError ? (
                <StyledErrorText>{screen.formError}</StyledErrorText>
              ) : null}
            </Card>
          </StyledPanel>
        </StyledLayout>
      ) : null}
    </StyledContainer>
  );
};

export default TheatreWorkbenchScreen;
