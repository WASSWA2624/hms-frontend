import React from 'react';
import { useRouter } from 'expo-router';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  Icon,
  LoadingSpinner,
  Modal,
  OfflineState,
  OfflineStateSizes,
  Select,
  Switch,
  Text,
  TextArea,
  TextField,
} from '@platform/components';
import {
  useAmbulance,
  useAmbulanceDispatch,
  useAmbulanceTrip,
  useClinicalAlert,
  useEmergencyResponse,
  useFollowUp,
  useI18n,
  useReferral,
} from '@hooks';
import {
  StyledCardGrid,
  StyledContainer,
  StyledFieldRow,
  StyledFlowList,
  StyledFlowListBadgeWrap,
  StyledFlowListEncounterMeta,
  StyledFlowListItem,
  StyledFlowListItemHeader,
  StyledFlowListMetaGroup,
  StyledFlowListMetaRow,
  StyledFlowListNumber,
  StyledFlowListProgress,
  StyledFlowListProgressDot,
  StyledFlowListSearch,
  StyledFlowStageChip,
  StyledFlowListPatientMeta,
  StyledFlowListPrimary,
  StyledFlowListTitle,
  StyledForm,
  StyledGuidanceList,
  StyledInlineActions,
  StyledLookupActions,
  StyledLayout,
  StyledContextCard,
  StyledContextGrid,
  StyledContextValue,
  StyledLinkedRecordItem,
  StyledLinkedRecordLabel,
  StyledLinkedRecordValue,
  StyledMeta,
  StyledPanel,
  StyledPanelHeader,
  StyledProgressDot,
  StyledProgressStep,
  StyledProgressStepIndex,
  StyledProgressTracker,
  StyledShortcutActions,
  StyledSectionTitle,
  StyledTriageLegend,
  StyledTriageLegendItem,
  StyledModalBody,
  StyledTimeline,
  StyledTimelineItem,
  StyledTimelineMeta,
  StyledVitalInsightRow,
  StyledWorkbenchDescription,
  StyledWorkbenchHeader,
  StyledWorkbenchHeading,
  StyledWorkbenchTitle,
} from './OpdFlowWorkbenchScreen.styles';
import useOpdFlowWorkbenchScreen from './useOpdFlowWorkbenchScreen';
import { PriceInputField } from '@platform/components';

const toSelectOptions = (t, options = []) =>
  options.map((option) => ({
    value: option.value,
    label: option.label || (option.labelKey ? t(option.labelKey) : option.value),
  }));

const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const toCleanText = (value) => String(value || '').trim();
const isUuidLike = (value) => UUID_LIKE_REGEX.test(toCleanText(value));
const toPublicIdText = (value) => {
  const text = toCleanText(value);
  if (!text || isUuidLike(text)) return '';
  return text;
};
const toPublicIdListText = (value) => {
  const values = Array.isArray(value)
    ? value
    : toCleanText(value)
      ? String(value).split(',')
      : [];
  const publicValues = values
    .map((item) => toPublicIdText(item))
    .filter(Boolean);
  return publicValues.join(', ');
};

const renderLinkedId = (t, label, value) => (
  <StyledLinkedRecordItem>
    <StyledLinkedRecordLabel>{label}</StyledLinkedRecordLabel>
    <StyledLinkedRecordValue>{toPublicIdListText(value) || t('common.notAvailable')}</StyledLinkedRecordValue>
  </StyledLinkedRecordItem>
);

const FLOW_PHASES = Object.freeze({
  REGISTRATION: 'registration',
  TRIAGE: 'triage',
  REVIEW: 'review',
  ORDERS: 'orders',
  FINAL: 'final',
  UNKNOWN: 'unknown',
});

const FLOW_PHASE_BY_STAGE = Object.freeze({
  WAITING_CONSULTATION_PAYMENT: FLOW_PHASES.REGISTRATION,
  WAITING_VITALS: FLOW_PHASES.REGISTRATION,
  WAITING_DOCTOR_ASSIGNMENT: FLOW_PHASES.TRIAGE,
  WAITING_DOCTOR_REVIEW: FLOW_PHASES.REVIEW,
  LAB_REQUESTED: FLOW_PHASES.ORDERS,
  RADIOLOGY_REQUESTED: FLOW_PHASES.ORDERS,
  LAB_AND_RADIOLOGY_REQUESTED: FLOW_PHASES.ORDERS,
  PHARMACY_REQUESTED: FLOW_PHASES.ORDERS,
  WAITING_DISPOSITION: FLOW_PHASES.ORDERS,
  ADMITTED: FLOW_PHASES.FINAL,
  DISCHARGED: FLOW_PHASES.FINAL,
});

const FLOW_PROGRESS_INDEX_BY_STAGE = Object.freeze({
  WAITING_CONSULTATION_PAYMENT: 0,
  WAITING_VITALS: 0,
  WAITING_DOCTOR_ASSIGNMENT: 1,
  WAITING_DOCTOR_REVIEW: 2,
  LAB_REQUESTED: 3,
  RADIOLOGY_REQUESTED: 3,
  LAB_AND_RADIOLOGY_REQUESTED: 3,
  PHARMACY_REQUESTED: 3,
  WAITING_DISPOSITION: 3,
  ADMITTED: 4,
  DISCHARGED: 4,
});

const FLOW_PROGRESS_DOT_COUNT = 5;

const resolveFlowPhase = (stage) =>
  FLOW_PHASE_BY_STAGE[toCleanText(stage).toUpperCase()] || FLOW_PHASES.UNKNOWN;

const resolveFlowProgressIndex = (stage) => {
  const normalized = toCleanText(stage).toUpperCase();
  return Number.isInteger(FLOW_PROGRESS_INDEX_BY_STAGE[normalized])
    ? FLOW_PROGRESS_INDEX_BY_STAGE[normalized]
    : -1;
};

const resolvePatientName = (flowItem, fallbackTitle) => {
  const patient = flowItem?.encounter?.patient || flowItem?.patient || null;
  const firstName = toCleanText(patient?.first_name || patient?.firstName);
  const lastName = toCleanText(patient?.last_name || patient?.lastName);
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  return fullName || fallbackTitle;
};

const resolvePatientHumanFriendlyId = (flowItem) =>
  toPublicIdText(
    flowItem?.encounter?.patient?.human_friendly_id ||
      flowItem?.patient?.human_friendly_id ||
      flowItem?.patient_human_friendly_id ||
      flowItem?.encounter?.patient_human_friendly_id
  );

const resolveListItems = (value, explicitKeys = []) => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== 'object') return [];
  for (const key of explicitKeys) {
    if (Array.isArray(value[key])) return value[key];
  }
  if (Array.isArray(value.items)) return value.items;
  if (Array.isArray(value.data)) return value.data;
  return [];
};

const resolveEmergencyCaseId = (flow) =>
  toPublicIdText(
    flow?.linked_record_ids?.emergency_case_id ||
      flow?.flow?.emergency_case_id ||
      flow?.emergency_case?.human_friendly_id ||
      flow?.emergency_case_id
  );

const resolveAdmissionId = (flow) =>
  toPublicIdText(
    flow?.linked_record_ids?.admission_id ||
      flow?.flow?.admission_id ||
      flow?.admissions?.[0]?.human_friendly_id
  );

const resolveLookupPatientName = (patient) => {
  const firstName = toCleanText(patient?.first_name || patient?.firstName);
  const lastName = toCleanText(patient?.last_name || patient?.lastName);
  return [firstName, lastName].filter(Boolean).join(' ').trim();
};

const resolveVitalStatusVariant = (status) => {
  const normalized = toCleanText(status).toUpperCase();
  if (normalized === 'NORMAL') return 'success';
  if (normalized === 'CRITICAL') return 'error';
  if (normalized === 'ABNORMAL') return 'warning';
  return 'primary';
};

const OpdFlowWorkbenchScreen = ({
  routeBase = '/scheduling/opd-flows',
  workspaceVariant = 'scheduling',
}) => {
  const { t } = useI18n();
  const router = useRouter();
  const screen = useOpdFlowWorkbenchScreen({ routeBase, workspaceVariant });
  const isClinicalMode = workspaceVariant === 'clinical';
  const isEmergencyMode = workspaceVariant === 'emergency';
  const [actionError, setActionError] = React.useState('');
  const [actionBusyId, setActionBusyId] = React.useState('');
  const [emergencySectionError, setEmergencySectionError] = React.useState('');
  const [emergencyActionBusy, setEmergencyActionBusy] = React.useState('');
  const [emergencyResponses, setEmergencyResponses] = React.useState([]);
  const [ambulanceFleet, setAmbulanceFleet] = React.useState([]);
  const [dispatches, setDispatches] = React.useState([]);
  const [trips, setTrips] = React.useState([]);
  const [fleetSearchText, setFleetSearchText] = React.useState('');
  const [responseDraft, setResponseDraft] = React.useState({ notes: '', response_at: '' });
  const [dispatchDraft, setDispatchDraft] = React.useState({ ambulance_id: '', status: 'DISPATCHED', dispatched_at: '' });
  const [tripDraft, setTripDraft] = React.useState({ ambulance_id: '', started_at: '', ended_at: '' });
  const [isEmergencySectionLoading, setIsEmergencySectionLoading] = React.useState(false);
  const { acknowledge: acknowledgeClinicalAlert, resolve: resolveClinicalAlert } = useClinicalAlert();
  const { list: listEmergencyResponses, create: createEmergencyResponse } = useEmergencyResponse();
  const { list: listAmbulances } = useAmbulance();
  const { list: listAmbulanceDispatches, create: createAmbulanceDispatch } = useAmbulanceDispatch();
  const { list: listAmbulanceTrips, create: createAmbulanceTrip, update: updateAmbulanceTrip } = useAmbulanceTrip();
  const {
    approve: approveReferral,
    start: startReferral,
    cancel: cancelReferral,
    redeem: redeemReferral,
  } = useReferral();
  const { complete: completeFollowUp, cancel: cancelFollowUp } = useFollowUp();
  const correctionDraft = screen.stageCorrectionDraft || { stage_to: '', reason: '' };
  const isCorrectionDialogOpen = Boolean(screen.isCorrectionDialogOpen);
  const handleOpenCorrectionDialog = screen.onOpenCorrectionDialog || (() => {});
  const handleCloseCorrectionDialog = screen.onCloseCorrectionDialog || (() => {});
  const handleStageCorrectionDraftChange = screen.onStageCorrectionDraftChange || (() => {});
  const handleCorrectStage = screen.onCorrectStage || (() => {});
  const canCorrectStage = Boolean(screen.canCorrectStage);

  const arrivalModeOptions = toSelectOptions(t, screen.arrivalModeOptions);
  const emergencySeverityOptions = toSelectOptions(t, screen.emergencySeverityOptions);
  const triageLevelOptions = toSelectOptions(t, screen.triageLevelOptions);
  const paymentMethodOptions = toSelectOptions(t, screen.paymentMethodOptions);
  const vitalTypeOptions = toSelectOptions(t, screen.vitalTypeOptions);
  const diagnosisTypeOptions = toSelectOptions(t, screen.diagnosisTypeOptions);
  const medicationFrequencyOptions = toSelectOptions(t, screen.medicationFrequencyOptions);
  const medicationRouteOptions = toSelectOptions(t, screen.medicationRouteOptions);
  const dispositionOptions = toSelectOptions(t, screen.dispositionOptions);
  const queueScopeOptions = toSelectOptions(t, screen.queueScopeOptions || []);
  const correctionStageOptions = toSelectOptions(t, screen.correctionStageOptions || []);
  const triageLevelLegend = screen.triageLevelLegend || [];
  const vitalsRowsWithInsights = screen.vitalsRowsWithInsights || screen.vitalsDraft?.vitals || [];
  const vitalsStatusSummary = screen.vitalsStatusSummary || {
    normal: 0,
    abnormal: 0,
    critical: 0,
  };

  const activeFlow = screen.selectedFlow;
  const activeStage = screen.activeStage;
  const linkedIds = activeFlow?.linked_record_ids || {};
  const activeEmergencyCaseId = resolveEmergencyCaseId(activeFlow);
  const activeAdmissionId = resolveAdmissionId(activeFlow);
  const linkedPatientName = resolveLookupPatientName(screen.startLinkedPatient);
  const linkedPatientDisplayId = toPublicIdText(screen.startLinkedPatient?.human_friendly_id);
  const linkedAppointmentDisplayId = toPublicIdText(screen.startLinkedAppointment?.human_friendly_id);
  const activeEncounterId = toPublicIdText(linkedIds.encounter_id) || toPublicIdText(activeFlow?.encounter?.human_friendly_id);
  const activePatientId = resolvePatientHumanFriendlyId(activeFlow);
  const activeProviderId = toPublicIdText(activeFlow?.encounter?.provider_user_id);
  const carePlans = Array.isArray(activeFlow?.care_plans) ? activeFlow.care_plans : [];
  const clinicalAlerts = Array.isArray(activeFlow?.clinical_alerts) ? activeFlow.clinical_alerts : [];
  const referrals = Array.isArray(activeFlow?.referrals) ? activeFlow.referrals : [];
  const followUps = Array.isArray(activeFlow?.follow_ups) ? activeFlow.follow_ups : [];
  const workbenchTitle = isClinicalMode
    ? 'Clinical Workbench'
    : isEmergencyMode
      ? 'Emergency Workbench'
      : t('scheduling.opdFlow.title');
  const workbenchDescription = isClinicalMode
    ? 'Central workspace for encounter management, notes, diagnoses, procedures, vitals, plans, alerts, referrals, and follow-ups.'
    : isEmergencyMode
      ? 'Central paperless emergency operations workspace for queue, triage, response, dispatch, trips, and admission handoff.'
      : t('scheduling.opdFlow.description');

  const buildRoute = (path, params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      const text = toCleanText(value);
      if (text) query.set(key, text);
    });
    const encoded = query.toString();
    return encoded ? `${path}?${encoded}` : path;
  };

  const handleOpenResource = (resourcePath, params = {}) => {
    router.push(buildRoute(resourcePath, params));
  };

  const runLinkedAction = async (actionId, handler) => {
    setActionError('');
    setActionBusyId(actionId);
    try {
      const result = await handler();
      if (!result) {
        setActionError(isClinicalMode ? 'Unable to complete action.' : t('common.error'));
        return;
      }
      await screen.onRetry();
    } catch (_error) {
      setActionError(isClinicalMode ? 'Unable to complete action.' : t('common.error'));
    } finally {
      setActionBusyId('');
    }
  };

  const ambulanceOptions = React.useMemo(
    () =>
      ambulanceFleet
        .map((item) => {
          const id =
            toPublicIdText(item?.display_id) ||
            toPublicIdText(item?.human_friendly_id) ||
            toPublicIdText(item?.id);
          if (!id) return null;
          const identifier = toCleanText(item?.identifier);
          const status = toCleanText(item?.status);
          return {
            value: id,
            label: [identifier || id, status].filter(Boolean).join(' | '),
          };
        })
        .filter(Boolean),
    [ambulanceFleet]
  );

  const refreshEmergencyPanels = React.useCallback(async () => {
    if (!isEmergencyMode || !screen.canViewWorkbench || screen.isOffline) return;

    setIsEmergencySectionLoading(true);
    setEmergencySectionError('');

    try {
      const [responsesResult, dispatchResult, tripResult, ambulanceResult] = await Promise.all([
        activeEmergencyCaseId
          ? listEmergencyResponses({
              emergency_case_id: activeEmergencyCaseId,
              limit: 20,
              sort_by: 'response_at',
              order: 'desc',
            })
          : Promise.resolve([]),
        activeEmergencyCaseId
          ? listAmbulanceDispatches({
              emergency_case_id: activeEmergencyCaseId,
              limit: 20,
              sort_by: 'dispatched_at',
              order: 'desc',
            })
          : Promise.resolve([]),
        activeEmergencyCaseId
          ? listAmbulanceTrips({
              emergency_case_id: activeEmergencyCaseId,
              limit: 20,
              sort_by: 'started_at',
              order: 'desc',
            })
          : Promise.resolve([]),
        listAmbulances({
          limit: 40,
          sort_by: 'updated_at',
          order: 'desc',
          search: toCleanText(fleetSearchText) || undefined,
        }),
      ]);

      setEmergencyResponses(
        resolveListItems(responsesResult, ['responses']).slice(0, 20)
      );
      setDispatches(resolveListItems(dispatchResult, ['dispatches']).slice(0, 20));
      setTrips(resolveListItems(tripResult, ['trips']).slice(0, 20));
      setAmbulanceFleet(resolveListItems(ambulanceResult, ['ambulances']).slice(0, 40));
    } catch (_error) {
      setEmergencySectionError(t('common.error'));
    } finally {
      setIsEmergencySectionLoading(false);
    }
  }, [
    activeEmergencyCaseId,
    fleetSearchText,
    isEmergencyMode,
    listAmbulanceDispatches,
    listAmbulanceTrips,
    listAmbulances,
    listEmergencyResponses,
    screen.canViewWorkbench,
    screen.isOffline,
    t,
  ]);

  React.useEffect(() => {
    refreshEmergencyPanels();
  }, [refreshEmergencyPanels]);

  const runEmergencyAction = React.useCallback(
    async (actionId, handler) => {
      setEmergencyActionBusy(actionId);
      setEmergencySectionError('');
      try {
        const result = await handler();
        if (!result) {
          setEmergencySectionError(t('common.error'));
          return null;
        }
        await refreshEmergencyPanels();
        return result;
      } catch (_error) {
        setEmergencySectionError(t('common.error'));
        return null;
      } finally {
        setEmergencyActionBusy('');
      }
    },
    [refreshEmergencyPanels, t]
  );

  const handleCreateEmergencyResponse = React.useCallback(async () => {
    const notes = toCleanText(responseDraft.notes);
    if (!activeEmergencyCaseId || !notes) {
      setEmergencySectionError(t('common.error'));
      return;
    }
    await runEmergencyAction('create-response', async () =>
      createEmergencyResponse({
        emergency_case_id: activeEmergencyCaseId,
        response_at: toCleanText(responseDraft.response_at) || new Date().toISOString(),
        notes,
      })
    );
    setResponseDraft({ notes: '', response_at: '' });
  }, [
    activeEmergencyCaseId,
    createEmergencyResponse,
    responseDraft.notes,
    responseDraft.response_at,
    runEmergencyAction,
    t,
  ]);

  const handleCreateDispatch = React.useCallback(async () => {
    const ambulanceId = toCleanText(dispatchDraft.ambulance_id);
    if (!activeEmergencyCaseId || !ambulanceId) {
      setEmergencySectionError(t('common.error'));
      return;
    }
    await runEmergencyAction('create-dispatch', async () =>
      createAmbulanceDispatch({
        ambulance_id: ambulanceId,
        emergency_case_id: activeEmergencyCaseId,
        dispatched_at: toCleanText(dispatchDraft.dispatched_at) || new Date().toISOString(),
        status: toCleanText(dispatchDraft.status) || 'DISPATCHED',
      })
    );
    setDispatchDraft((previous) => ({ ...previous, dispatched_at: '' }));
  }, [
    activeEmergencyCaseId,
    createAmbulanceDispatch,
    dispatchDraft.ambulance_id,
    dispatchDraft.dispatched_at,
    dispatchDraft.status,
    runEmergencyAction,
    t,
  ]);

  const handleStartTrip = React.useCallback(async () => {
    const ambulanceId =
      toCleanText(tripDraft.ambulance_id) ||
      toCleanText(dispatchDraft.ambulance_id) ||
      toCleanText(dispatches[0]?.ambulance_display_id);
    if (!activeEmergencyCaseId || !ambulanceId) {
      setEmergencySectionError(t('common.error'));
      return;
    }
    await runEmergencyAction('start-trip', async () =>
      createAmbulanceTrip({
        ambulance_id: ambulanceId,
        emergency_case_id: activeEmergencyCaseId,
        started_at: toCleanText(tripDraft.started_at) || new Date().toISOString(),
      })
    );
    setTripDraft((previous) => ({ ...previous, started_at: '' }));
  }, [
    activeEmergencyCaseId,
    createAmbulanceTrip,
    dispatchDraft.ambulance_id,
    dispatches,
    runEmergencyAction,
    t,
    tripDraft.ambulance_id,
    tripDraft.started_at,
  ]);

  const handleEndTrip = React.useCallback(async () => {
    const openTrip = trips.find((item) => !toCleanText(item?.ended_at));
    const tripId =
      toPublicIdText(openTrip?.display_id) ||
      toPublicIdText(openTrip?.human_friendly_id) ||
      toPublicIdText(openTrip?.id);
    if (!tripId) {
      setEmergencySectionError(t('common.error'));
      return;
    }
    await runEmergencyAction('end-trip', async () =>
      updateAmbulanceTrip(tripId, {
        ended_at: toCleanText(tripDraft.ended_at) || new Date().toISOString(),
      })
    );
    setTripDraft((previous) => ({ ...previous, ended_at: '' }));
  }, [t, tripDraft.ended_at, trips, runEmergencyAction, updateAmbulanceTrip]);

  const renderStartForm = () => (
    <Card variant="outlined" testID="opd-workbench-start-form">
      <StyledForm>
        <StyledFieldRow>
          <Select
            label={t('scheduling.opdFlow.start.arrivalMode')}
            value={screen.startDraft.arrival_mode}
            options={arrivalModeOptions}
            onValueChange={(value) => screen.onStartDraftChange('arrival_mode', value)}
            compact
          />
          <TextField
            label={t('scheduling.opdFlow.start.patientSearch')}
            value={screen.startPatientSearchText}
            onChangeText={screen.onStartPatientSearchChange}
            helperText={
              screen.isPatientSearchLoading
                ? t('scheduling.opdFlow.start.patientSearchLoading')
                : t('scheduling.opdFlow.start.patientSearchHint')
            }
            density="compact"
          />
        </StyledFieldRow>
        <StyledFieldRow>
          <Select
            label={t('scheduling.opdFlow.start.patientId')}
            value={screen.startDraft.patient_id}
            options={screen.startPatientOptions}
            onValueChange={screen.onStartPatientSelect}
            helperText={
              screen.isPatientLookupLoading
                ? t('scheduling.opdFlow.start.patientLookupLoading')
                : linkedPatientDisplayId
                  ? t('scheduling.opdFlow.start.patientResolved', { id: linkedPatientDisplayId })
                  : t('scheduling.opdFlow.start.patientIdHint')
            }
            compact
            searchable
            testID="opd-workbench-start-patient-select"
          />
          <TextField
            label={t('scheduling.opdFlow.start.providerSearch')}
            value={screen.startProviderSearchText}
            onChangeText={screen.onStartProviderSearchChange}
            helperText={
              screen.isProviderSearchLoading
                ? t('scheduling.opdFlow.start.providerSearchLoading')
                : t('scheduling.opdFlow.start.providerSearchHint')
            }
            density="compact"
          />
        </StyledFieldRow>
        <StyledLookupActions>
          <Button
            variant="surface"
            size="small"
            onPress={screen.onResolveStartPatient}
            disabled={screen.isPatientLookupLoading || !screen.startDraft.patient_id}
          >
            {t('scheduling.opdFlow.start.loadPatient')}
          </Button>
          {screen.startLinkedPatient ? (
            <Button
              variant="surface"
              size="small"
              onPress={screen.onOpenPatientShortcut}
              icon={<Icon glyph={'\u21b1'} size="xs" decorative />}
            >
              {t('scheduling.opdFlow.start.shortcuts.openPatient')}
            </Button>
          ) : null}
        </StyledLookupActions>

        {screen.startDraft.arrival_mode === 'ONLINE_APPOINTMENT' ? (
          <>
            <TextField
              label={t('scheduling.opdFlow.start.appointmentId')}
              value={screen.startDraft.appointment_id}
              onChangeText={(value) => screen.onStartDraftChange('appointment_id', value)}
              helperText={
                screen.isAppointmentLookupLoading
                  ? t('scheduling.opdFlow.start.appointmentLookupLoading')
                  : linkedAppointmentDisplayId
                    ? t('scheduling.opdFlow.start.appointmentResolved', { id: linkedAppointmentDisplayId })
                    : t('scheduling.opdFlow.start.appointmentIdHint')
              }
              density="compact"
            />
            <StyledLookupActions>
              <Button
                variant="surface"
                size="small"
                onPress={screen.onResolveStartAppointment}
                disabled={screen.isAppointmentLookupLoading || !screen.startDraft.appointment_id}
              >
                {t('scheduling.opdFlow.start.loadAppointment')}
              </Button>
            </StyledLookupActions>
          </>
        ) : null}

        {screen.startLookupError ? (
          <Text variant="caption">{screen.startLookupError}</Text>
        ) : null}

        {screen.startLinkedPatient || screen.startLinkedAppointment ? (
          <StyledContextCard>
            <Text variant="label">{t('scheduling.opdFlow.start.autoLinkedContext')}</Text>
            <StyledContextGrid>
              <StyledContextValue>
                {`${t('scheduling.opdFlow.start.patientLabel')}: ${
                  linkedPatientName || t('common.notAvailable')
                }`}
              </StyledContextValue>
              <StyledContextValue>
                {`${t('scheduling.opdFlow.start.patientId')}: ${
                  linkedPatientDisplayId || t('common.notAvailable')
                }`}
              </StyledContextValue>
              <StyledContextValue>
                {`${t('scheduling.opdFlow.start.appointmentLabel')}: ${
                  linkedAppointmentDisplayId || t('common.notAvailable')
                }`}
              </StyledContextValue>
              <StyledContextValue>
                {`${t('scheduling.opdFlow.start.providerLabel')}: ${
                  toPublicIdText(screen.startDraft.provider_user_id) || t('common.notAvailable')
                }`}
              </StyledContextValue>
            </StyledContextGrid>
            <StyledShortcutActions>
              <Button
                variant="surface"
                size="small"
                onPress={screen.onOpenPatientShortcut}
                disabled={!screen.startLinkedPatient}
              >
                {t('scheduling.opdFlow.start.shortcuts.openPatient')}
              </Button>
              <Button
                variant="surface"
                size="small"
                onPress={screen.onOpenAdmissionShortcut}
              >
                {t('scheduling.opdFlow.start.shortcuts.startAdmission')}
              </Button>
              <Button
                variant="surface"
                size="small"
                onPress={screen.onOpenOpdShortcut}
              >
                {t('scheduling.opdFlow.start.shortcuts.openOpd')}
              </Button>
            </StyledShortcutActions>
          </StyledContextCard>
        ) : null}

        {!screen.startDraft.patient_id && !screen.startDraft.appointment_id ? (
          <StyledFieldRow>
            <TextField
              label={t('scheduling.opdFlow.start.firstName')}
              value={screen.startDraft.first_name}
              onChangeText={(value) => screen.onStartDraftChange('first_name', value)}
              density="compact"
            />
            <TextField
              label={t('scheduling.opdFlow.start.lastName')}
              value={screen.startDraft.last_name}
              onChangeText={(value) => screen.onStartDraftChange('last_name', value)}
              density="compact"
            />
          </StyledFieldRow>
        ) : null}

        <StyledFieldRow>
          <Select
            label={t('scheduling.opdFlow.start.providerUserId')}
            value={screen.startDraft.provider_user_id}
            options={screen.providerOptions}
            onValueChange={screen.onStartProviderSelect}
            helperText={t('scheduling.opdFlow.start.providerIdHint')}
            compact
            searchable
            testID="opd-workbench-start-provider-select"
          />
          <TextField
            label={t('scheduling.opdFlow.start.notes')}
            value={screen.startDraft.notes}
            onChangeText={(value) => screen.onStartDraftChange('notes', value)}
            density="compact"
          />
        </StyledFieldRow>

        <StyledInlineActions>
          <Button
            variant="surface"
            size="small"
            onPress={() => screen.setIsStartAdvancedOpen((previous) => !previous)}
          >
            {screen.isStartAdvancedOpen
              ? t('scheduling.opdFlow.actions.hideAdvanced')
              : t('scheduling.opdFlow.actions.showAdvanced')}
          </Button>
        </StyledInlineActions>

        {screen.isStartAdvancedOpen ? (
          <>
            <PriceInputField
              amountLabel={t('scheduling.opdFlow.start.consultationFee')}
              amountValue={screen.startDraft.consultation_fee}
              onAmountChange={(value) => screen.onStartDraftChange('consultation_fee', value)}
              currencyLabel={t('scheduling.opdFlow.start.currency')}
              currencyValue={screen.startDraft.currency}
              onCurrencyChange={(value) => screen.onStartDraftChange('currency', value)}
              currencyOptions={screen.currencyOptions}
              amountTestId="opd-workbench-start-fee"
              currencyTestId="opd-workbench-start-currency"
            />

            {screen.startDraft.arrival_mode !== 'EMERGENCY' ? (
              <StyledInlineActions>
                <Switch
                  label={t('scheduling.opdFlow.start.requirePayment')}
                  value={Boolean(screen.startDraft.require_consultation_payment)}
                  onValueChange={(value) =>
                    screen.onStartDraftChange('require_consultation_payment', Boolean(value))
                  }
                />
                <Switch
                  label={t('scheduling.opdFlow.start.createInvoice')}
                  value={Boolean(screen.startDraft.create_consultation_invoice)}
                  onValueChange={(value) =>
                    screen.onStartDraftChange('create_consultation_invoice', Boolean(value))
                  }
                />
              </StyledInlineActions>
            ) : null}

            <Switch
              label={t('scheduling.opdFlow.start.payNow')}
              value={Boolean(screen.startDraft.pay_now_enabled)}
              onValueChange={(value) =>
                screen.onStartDraftChange('pay_now_enabled', Boolean(value))
              }
            />

            {screen.startDraft.pay_now_enabled ? (
              <StyledFieldRow>
                <Select
                  label={t('scheduling.opdFlow.start.payNowMethod')}
                  value={screen.startDraft.pay_now_method}
                  options={paymentMethodOptions}
                  onValueChange={(value) => screen.onStartDraftChange('pay_now_method', value)}
                  compact
                />
                <TextField
                  label={t('scheduling.opdFlow.start.payNowAmount')}
                  value={screen.startDraft.pay_now_amount}
                  onChangeText={(value) => screen.onStartDraftChange('pay_now_amount', value)}
                  density="compact"
                />
              </StyledFieldRow>
            ) : null}
          </>
        ) : null}

        {screen.startDraft.arrival_mode === 'EMERGENCY' ? (
          <>
            <StyledFieldRow>
              <Select
                label={t('scheduling.opdFlow.start.emergencySeverity')}
                value={screen.startDraft.emergency_severity}
                options={emergencySeverityOptions}
                onValueChange={(value) => screen.onStartDraftChange('emergency_severity', value)}
                compact
              />
              <Select
                label={t('scheduling.opdFlow.start.emergencyTriageLevel')}
                value={screen.startDraft.emergency_triage_level}
                options={triageLevelOptions}
                onValueChange={(value) =>
                  screen.onStartDraftChange('emergency_triage_level', value)
                }
                compact
              />
            </StyledFieldRow>
            <TextArea
              label={t('scheduling.opdFlow.start.emergencyNotes')}
              value={screen.startDraft.emergency_notes}
              onChangeText={(value) => screen.onStartDraftChange('emergency_notes', value)}
            />
          </>
        ) : null}

        <StyledInlineActions>
          <Button
            variant="surface"
            size="small"
            onPress={screen.onStartFlow}
            disabled={!screen.canStartFlow || !screen.canMutate}
            testID="opd-workbench-start-submit"
            icon={<Icon glyph="+" size="xs" decorative />}
          >
            {t('scheduling.opdFlow.actions.startFlow')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={() => screen.setIsStartFormOpen(false)}
            icon={<Icon glyph={'\u2715'} size="xs" decorative />}
          >
            {t('common.cancel')}
          </Button>
        </StyledInlineActions>
      </StyledForm>
    </Card>
  );

  const renderPaymentForm = () => (
    <StyledForm>
      <StyledFieldRow>
        <Select
          label={t('scheduling.opdFlow.payment.method')}
          value={screen.paymentDraft.method}
          options={paymentMethodOptions}
          onValueChange={(value) => screen.onPaymentDraftChange('method', value)}
          compact
        />
        <TextField
          label={t('scheduling.opdFlow.payment.transactionRef')}
          value={screen.paymentDraft.transaction_ref}
          onChangeText={(value) => screen.onPaymentDraftChange('transaction_ref', value)}
          density="compact"
        />
      </StyledFieldRow>
      <PriceInputField
        amountLabel={t('scheduling.opdFlow.payment.amount')}
        amountValue={screen.paymentDraft.amount}
        onAmountChange={(value) => screen.onPaymentDraftChange('amount', value)}
        currencyLabel={t('scheduling.opdFlow.payment.currency')}
        currencyValue={screen.paymentDraft.currency}
        onCurrencyChange={(value) => screen.onPaymentDraftChange('currency', value)}
        currencyOptions={screen.currencyOptions}
        amountTestId="opd-workbench-payment-amount"
        currencyTestId="opd-workbench-payment-currency"
      />
      <TextArea
        label={t('scheduling.opdFlow.payment.notes')}
        value={screen.paymentDraft.notes}
        onChangeText={(value) => screen.onPaymentDraftChange('notes', value)}
      />
      <Button
        variant="surface"
        size="small"
        onPress={screen.onPayConsultation}
        disabled={!screen.canSubmitCurrentAction}
        testID="opd-workbench-pay-submit"
      >
        {t('scheduling.opdFlow.actions.payConsultation')}
      </Button>
    </StyledForm>
  );

  const renderVitalsForm = () => (
    <StyledForm>
      <StyledInlineActions>
        <Text variant="label">{t('scheduling.opdFlow.vitals.title')}</Text>
        {screen.contextPatientAgeLabel ? (
          <Badge variant="primary" size="small">
            {screen.contextPatientAgeLabel}
          </Badge>
        ) : null}
        {vitalsStatusSummary ? (
          <>
            <Badge variant="success" size="small">
              {t('scheduling.opdFlow.vitals.summary.normal', { count: vitalsStatusSummary.normal })}
            </Badge>
            <Badge variant="warning" size="small">
              {t('scheduling.opdFlow.vitals.summary.abnormal', { count: vitalsStatusSummary.abnormal })}
            </Badge>
            <Badge variant="error" size="small">
              {t('scheduling.opdFlow.vitals.summary.critical', { count: vitalsStatusSummary.critical })}
            </Badge>
          </>
        ) : null}
        <Button
          variant="surface"
          size="small"
          onPress={screen.onAddVitalRow}
          disabled={!screen.canMutate}
          icon={<Icon glyph="+" size="xs" decorative />}
        >
          {t('scheduling.opdFlow.actions.addRow')}
        </Button>
      </StyledInlineActions>
      {vitalsRowsWithInsights.map((row, index) => (
        <React.Fragment key={`vital-row-${index + 1}`}>
          <StyledFieldRow>
            <Select
              label={t('scheduling.opdFlow.vitals.vitalType')}
              value={row.vital_type}
              options={vitalTypeOptions}
              onValueChange={(value) => screen.onVitalRowChange(index, 'vital_type', value)}
              compact
            />
            <Select
              label={t('scheduling.opdFlow.vitals.unit')}
              value={row.unit}
              options={
                ((row.unitOptions && row.unitOptions.length > 0)
                  ? row.unitOptions
                  : [row.unit || t('scheduling.opdFlow.vitals.unitUnknown')]).map((unitValue) => ({
                  value: unitValue,
                  label: unitValue,
                }))
              }
              onValueChange={(value) => screen.onVitalRowChange(index, 'unit', value)}
              compact
            />
          </StyledFieldRow>

          {row.isBloodPressure ? (
            <>
              <StyledFieldRow>
                <TextField
                  label={t('scheduling.opdFlow.vitals.systolic')}
                  value={String(row.systolic_value || '')}
                  onChangeText={(value) => screen.onVitalRowChange(index, 'systolic_value', value)}
                  density="compact"
                />
                <TextField
                  label={t('scheduling.opdFlow.vitals.diastolic')}
                  value={String(row.diastolic_value || '')}
                  onChangeText={(value) => screen.onVitalRowChange(index, 'diastolic_value', value)}
                  density="compact"
                />
              </StyledFieldRow>
              <StyledFieldRow>
                <TextField
                  label={t('scheduling.opdFlow.vitals.map')}
                  value={String(row.map_value || '')}
                  onChangeText={(value) => screen.onVitalRowChange(index, 'map_value', value)}
                  helperText={
                    row.map_is_manual
                      ? t('scheduling.opdFlow.vitals.mapManual')
                      : t('scheduling.opdFlow.vitals.mapAuto', { value: row.map_auto_value || '-' })
                  }
                  density="compact"
                />
                <TextField
                  label={t('scheduling.opdFlow.vitals.value')}
                  value={
                    row.resolvedBloodPressure?.systolic != null && row.resolvedBloodPressure?.diastolic != null
                      ? `${row.resolvedBloodPressure.systolic}/${row.resolvedBloodPressure.diastolic}`
                      : ''
                  }
                  helperText={t('scheduling.opdFlow.vitals.bloodPressureCanonicalHint')}
                  density="compact"
                  disabled
                />
              </StyledFieldRow>
            </>
          ) : (
            <StyledFieldRow>
              <TextField
                label={t('scheduling.opdFlow.vitals.value')}
                value={row.value}
                onChangeText={(value) => screen.onVitalRowChange(index, 'value', value)}
                density="compact"
              />
            </StyledFieldRow>
          )}

          <StyledVitalInsightRow>
            <Badge variant={resolveVitalStatusVariant(row.status)} size="small">
              {t(`scheduling.opdFlow.vitals.status.${String(row.status || 'INCOMPLETE').toUpperCase()}`)}
            </Badge>
            <Text variant="caption">
              {row.rangeText
                ? t('scheduling.opdFlow.vitals.referenceRange', { range: row.rangeText })
                : t(row.rangeTextKey || 'scheduling.opdFlow.vitals.range.awaitingValue')}
            </Text>
            <Button
              variant="surface"
              size="small"
              onPress={() => screen.onRemoveVitalRow(index)}
              disabled={!screen.canMutate}
              icon={<Icon glyph={'\u2715'} size="xs" decorative />}
            >
              {t('scheduling.opdFlow.actions.removeRow')}
            </Button>
          </StyledVitalInsightRow>
        </React.Fragment>
      ))}
      <StyledTriageLegend>
        {triageLevelLegend.map((item) => (
          <StyledTriageLegendItem key={item.value}>
            <Badge variant={item.badgeVariant} size="small">
              {t(item.colorCodeKey)}
            </Badge>
            <Text variant="caption">{t(item.labelKey)}</Text>
          </StyledTriageLegendItem>
        ))}
      </StyledTriageLegend>
      <StyledFieldRow>
        <Select
          label={t('scheduling.opdFlow.vitals.triageLevel')}
          value={screen.vitalsDraft.triage_level}
          options={triageLevelOptions}
          onValueChange={(value) => screen.onVitalsFieldChange('triage_level', value)}
          compact
        />
        <TextArea
          label={t('scheduling.opdFlow.vitals.triageNotes')}
          value={screen.vitalsDraft.triage_notes}
          onChangeText={(value) => screen.onVitalsFieldChange('triage_notes', value)}
        />
      </StyledFieldRow>
      <Button
        variant="surface"
        size="small"
        onPress={screen.onRecordVitals}
        disabled={!screen.canSubmitCurrentAction}
        testID="opd-workbench-vitals-submit"
      >
        {t('scheduling.opdFlow.actions.recordVitals')}
      </Button>
    </StyledForm>
  );

  const renderAssignDoctorForm = () => (
    <StyledForm>
      <TextField
        label={t('scheduling.opdFlow.assign.providerSearch')}
        value={screen.assignProviderSearchText}
        onChangeText={screen.onAssignProviderSearchChange}
        helperText={
          screen.isProviderSearchLoading
            ? t('scheduling.opdFlow.start.providerSearchLoading')
            : t('scheduling.opdFlow.start.providerSearchHint')
        }
        density="compact"
      />
      <Select
        label={t('scheduling.opdFlow.assign.providerUserId')}
        value={screen.assignDraft.provider_user_id}
        options={screen.providerOptions}
        onValueChange={screen.onAssignProviderSelect}
        compact
        searchable
        testID="opd-workbench-assign-provider-select"
      />
      <Button
        variant="surface"
        size="small"
        onPress={screen.onAssignDoctor}
        disabled={!screen.canSubmitCurrentAction}
        testID="opd-workbench-assign-submit"
      >
        {t('scheduling.opdFlow.actions.assignDoctor')}
      </Button>
    </StyledForm>
  );

  const renderReviewRows = (section, rows, fields, addLabel) => (
    <StyledForm>
      <StyledInlineActions>
        <Text variant="label">{addLabel}</Text>
        <Button
          variant="surface"
          size="small"
          onPress={() => screen.onAddReviewRow(section)}
          disabled={!screen.canMutate}
          icon={<Icon glyph="+" size="xs" decorative />}
        >
          {t('scheduling.opdFlow.actions.addRow')}
        </Button>
      </StyledInlineActions>
      {rows.map((row, index) => (
        <StyledFieldRow key={`${section}-row-${index + 1}`}>
          {fields.map((field) => {
            if (field.type === 'select') {
              return (
                <Select
                  key={`${section}-${field.name}-${index + 1}`}
                  label={field.label}
                  value={row[field.name]}
                  options={field.options}
                  onValueChange={(value) =>
                    screen.onReviewRowChange(section, index, field.name, value)
                  }
                  compact
                />
              );
            }

            return (
              <TextField
                key={`${section}-${field.name}-${index + 1}`}
                label={field.label}
                value={String(row[field.name] || '')}
                onChangeText={(value) =>
                  screen.onReviewRowChange(section, index, field.name, value)
                }
                density="compact"
              />
            );
          })}
          <Button
            variant="surface"
            size="small"
            onPress={() => screen.onRemoveReviewRow(section, index)}
            disabled={!screen.canMutate}
            icon={<Icon glyph={'\u2715'} size="xs" decorative />}
          >
            {t('scheduling.opdFlow.actions.removeRow')}
          </Button>
        </StyledFieldRow>
      ))}
    </StyledForm>
  );

  const renderDoctorReviewForm = () => (
    <StyledForm>
      <TextArea
        label={t('scheduling.opdFlow.review.note')}
        value={screen.reviewDraft.note}
        onChangeText={(value) => screen.onReviewDraftChange('note', value)}
      />

      {renderReviewRows(
        'diagnoses',
        screen.reviewDraft.diagnoses,
        [
          {
            name: 'diagnosis_type',
            label: t('scheduling.opdFlow.review.diagnosisType'),
            type: 'select',
            options: diagnosisTypeOptions,
          },
          { name: 'code', label: t('scheduling.opdFlow.review.code') },
          { name: 'description', label: t('scheduling.opdFlow.review.description') },
        ],
        t('scheduling.opdFlow.review.diagnoses')
      )}

      {renderReviewRows(
        'procedures',
        screen.reviewDraft.procedures,
        [
          { name: 'code', label: t('scheduling.opdFlow.review.code') },
          { name: 'description', label: t('scheduling.opdFlow.review.description') },
        ],
        t('scheduling.opdFlow.review.procedures')
      )}

      {renderReviewRows(
        'lab_requests',
        screen.reviewDraft.lab_requests,
        [{ name: 'lab_test_id', label: t('scheduling.opdFlow.review.labTestId') }],
        t('scheduling.opdFlow.review.labRequests')
      )}

      {renderReviewRows(
        'radiology_requests',
        screen.reviewDraft.radiology_requests,
        [{ name: 'radiology_test_id', label: t('scheduling.opdFlow.review.radiologyTestId') }],
        t('scheduling.opdFlow.review.radiologyRequests')
      )}

      {renderReviewRows(
        'medications',
        screen.reviewDraft.medications,
        [
          { name: 'drug_id', label: t('scheduling.opdFlow.review.drugId') },
          { name: 'quantity', label: t('scheduling.opdFlow.review.quantity') },
          {
            name: 'frequency',
            label: t('scheduling.opdFlow.review.frequency'),
            type: 'select',
            options: medicationFrequencyOptions,
          },
          {
            name: 'route',
            label: t('scheduling.opdFlow.review.route'),
            type: 'select',
            options: medicationRouteOptions,
          },
        ],
        t('scheduling.opdFlow.review.medications')
      )}

      <TextArea
        label={t('scheduling.opdFlow.review.additionalNotes')}
        value={screen.reviewDraft.notes}
        onChangeText={(value) => screen.onReviewDraftChange('notes', value)}
      />

      <Button
        variant="surface"
        size="small"
        onPress={screen.onDoctorReview}
        disabled={!screen.canSubmitCurrentAction}
        testID="opd-workbench-review-submit"
      >
        {t('scheduling.opdFlow.actions.doctorReview')}
      </Button>
    </StyledForm>
  );

  const renderDispositionForm = () => (
    <StyledForm>
      <Select
        label={t('scheduling.opdFlow.disposition.decision')}
        value={screen.dispositionDraft.decision}
        options={dispositionOptions}
        onValueChange={(value) => screen.onDispositionDraftChange('decision', value)}
        compact
      />
      {screen.dispositionDraft.decision === 'ADMIT' ? (
        <TextField
          label={t('scheduling.opdFlow.disposition.admissionFacilityId')}
          value={screen.dispositionDraft.admission_facility_id}
          onChangeText={(value) => screen.onDispositionDraftChange('admission_facility_id', value)}
          density="compact"
        />
      ) : null}
      <TextArea
        label={t('scheduling.opdFlow.disposition.notes')}
        value={screen.dispositionDraft.notes}
        onChangeText={(value) => screen.onDispositionDraftChange('notes', value)}
      />
      <Button
        variant="surface"
        size="small"
        onPress={screen.onDisposition}
        disabled={!screen.canSubmitCurrentAction}
        testID="opd-workbench-disposition-submit"
      >
        {t('scheduling.opdFlow.actions.disposition')}
      </Button>
    </StyledForm>
  );

  const renderActionSection = () => {
    if (!activeFlow) {
      return (
        <EmptyState
          title={t('scheduling.opdFlow.states.noSelection')}
          description={t('scheduling.opdFlow.states.selectFlow')}
          testID="opd-workbench-empty-selection"
        />
      );
    }

    if (screen.isTerminalStage) {
      return (
        <Text variant="body" testID="opd-workbench-terminal-summary">
          {t('scheduling.opdFlow.states.terminalSummary')}
        </Text>
      );
    }

    if (screen.formError) {
      return (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title={t('scheduling.opdFlow.states.validationErrorTitle')}
          description={screen.formError}
          testID="opd-workbench-form-error"
        />
      );
    }

    if (!screen.canSubmitCurrentAction) {
      return (
        <Text variant="caption" testID="opd-workbench-action-disabled">
          {screen.isOffline
            ? t('scheduling.opdFlow.states.offlineActionsDisabled')
            : t('scheduling.opdFlow.states.actionNotAllowed')}
        </Text>
      );
    }

    if (screen.stageAction === 'PAY_CONSULTATION') return renderPaymentForm();
    if (screen.stageAction === 'RECORD_VITALS') return renderVitalsForm();
    if (screen.stageAction === 'ASSIGN_DOCTOR') return renderAssignDoctorForm();
    if (screen.stageAction === 'DOCTOR_REVIEW') return renderDoctorReviewForm();
    if (screen.stageAction === 'DISPOSITION') return renderDispositionForm();

    return (
      <Text variant="caption" testID="opd-workbench-action-unavailable">
        {t('scheduling.opdFlow.states.noActionForStage')}
      </Text>
    );
  };

  const renderClinicalModuleLinks = () => {
    if (!isClinicalMode) return null;
    if (!activeEncounterId) {
      return (
        <Text variant="caption" testID="clinical-workbench-no-encounter">
          Select an encounter from the queue to open module actions.
        </Text>
      );
    }

    const followUpDefaultAt = new Date(Date.now() + (24 * 60 * 60 * 1000)).toISOString();

    return (
      <>
        <StyledShortcutActions>
          <Button
            variant="surface"
            size="small"
            onPress={() => handleOpenResource('/clinical/encounters')}
          >
            Encounters
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={() =>
              handleOpenResource('/clinical/clinical-notes/create', {
                encounterId: activeEncounterId,
                authorUserId: activeProviderId,
              })
            }
          >
            Add Note
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={() =>
              handleOpenResource('/clinical/diagnoses/create', {
                encounterId: activeEncounterId,
              })
            }
          >
            Add Diagnosis
          </Button>
        </StyledShortcutActions>

        <StyledShortcutActions>
          <Button
            variant="surface"
            size="small"
            onPress={() =>
              handleOpenResource('/clinical/procedures/create', {
                encounterId: activeEncounterId,
              })
            }
          >
            Add Procedure
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={() =>
              handleOpenResource('/clinical/vital-signs/create', {
                encounterId: activeEncounterId,
              })
            }
          >
            Add Vitals
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={() =>
              handleOpenResource('/clinical/care-plans/create', {
                encounterId: activeEncounterId,
                startDate: new Date().toISOString(),
              })
            }
          >
            Add Care Plan
          </Button>
        </StyledShortcutActions>

        <StyledShortcutActions>
          <Button
            variant="surface"
            size="small"
            onPress={() =>
              handleOpenResource('/clinical/clinical-alerts/create', {
                encounterId: activeEncounterId,
                severity: 'HIGH',
              })
            }
          >
            Add Alert
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={() =>
              handleOpenResource('/clinical/referrals/create', {
                encounterId: activeEncounterId,
              })
            }
          >
            Add Referral
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={() =>
              handleOpenResource('/clinical/follow-ups/create', {
                encounterId: activeEncounterId,
                scheduledAt: followUpDefaultAt,
              })
            }
          >
            Add Follow-up
          </Button>
        </StyledShortcutActions>
      </>
    );
  };

  const renderLinkedClinicalRecords = () => {
    if (!isClinicalMode || !activeEncounterId) return null;

    const resolvePublicRecordId = (item) =>
      toPublicIdText(item?.human_friendly_id) || toCleanText(item?.id);
    const actionDisabled = !screen.canMutate || Boolean(actionBusyId);

    return (
      <>
        {actionError ? <Text variant="caption">{actionError}</Text> : null}
        <StyledContextGrid>
          {clinicalAlerts.slice(0, 4).map((item) => {
            const status = toCleanText(item?.status || 'OPEN').toUpperCase();
            const alertId = resolvePublicRecordId(item);
            return (
              <StyledContextCard key={`alert-${alertId || item?.message}`}>
                <Text variant="label">{`Alert: ${toCleanText(item?.severity || 'MEDIUM')}`}</Text>
                <StyledContextValue>{toCleanText(item?.message) || 'No message'}</StyledContextValue>
                <StyledMeta>{`Status: ${status}`}</StyledMeta>
                <StyledShortcutActions>
                  {status === 'OPEN' ? (
                    <Button
                      variant="surface"
                      size="small"
                      disabled={!alertId || actionDisabled}
                      onPress={() =>
                        runLinkedAction(`alert-ack-${alertId}`, () => acknowledgeClinicalAlert(alertId))
                      }
                    >
                      Acknowledge
                    </Button>
                  ) : null}
                  {status === 'OPEN' || status === 'ACKNOWLEDGED' ? (
                    <Button
                      variant="surface"
                      size="small"
                      disabled={!alertId || actionDisabled}
                      onPress={() =>
                        runLinkedAction(`alert-resolve-${alertId}`, () => resolveClinicalAlert(alertId))
                      }
                    >
                      Resolve
                    </Button>
                  ) : null}
                </StyledShortcutActions>
              </StyledContextCard>
            );
          })}

          {referrals.slice(0, 4).map((item) => {
            const status = toCleanText(item?.status || 'REQUESTED').toUpperCase();
            const referralId = resolvePublicRecordId(item);
            return (
              <StyledContextCard key={`referral-${referralId || item?.reason}`}>
                <Text variant="label">Referral</Text>
                <StyledContextValue>{toCleanText(item?.reason) || 'No reason provided'}</StyledContextValue>
                <StyledMeta>{`Status: ${status}`}</StyledMeta>
                <StyledShortcutActions>
                  {status === 'REQUESTED' ? (
                    <Button
                      variant="surface"
                      size="small"
                      disabled={!referralId || actionDisabled}
                      onPress={() =>
                        runLinkedAction(`ref-approve-${referralId}`, () => approveReferral(referralId))
                      }
                    >
                      Approve
                    </Button>
                  ) : null}
                  {status === 'APPROVED' ? (
                    <Button
                      variant="surface"
                      size="small"
                      disabled={!referralId || actionDisabled}
                      onPress={() =>
                        runLinkedAction(`ref-start-${referralId}`, () => startReferral(referralId))
                      }
                    >
                      Start
                    </Button>
                  ) : null}
                  {status === 'IN_PROGRESS' ? (
                    <Button
                      variant="surface"
                      size="small"
                      disabled={!referralId || actionDisabled}
                      onPress={() =>
                        runLinkedAction(`ref-complete-${referralId}`, () => redeemReferral(referralId))
                      }
                    >
                      Complete
                    </Button>
                  ) : null}
                  {status !== 'COMPLETED' && status !== 'CANCELLED' ? (
                    <Button
                      variant="surface"
                      size="small"
                      disabled={!referralId || actionDisabled}
                      onPress={() =>
                        runLinkedAction(`ref-cancel-${referralId}`, () => cancelReferral(referralId))
                      }
                    >
                      Cancel
                    </Button>
                  ) : null}
                </StyledShortcutActions>
              </StyledContextCard>
            );
          })}

          {followUps.slice(0, 4).map((item) => {
            const status = toCleanText(item?.status || 'SCHEDULED').toUpperCase();
            const followUpId = resolvePublicRecordId(item);
            return (
              <StyledContextCard key={`follow-up-${followUpId || item?.scheduled_at}`}>
                <Text variant="label">Follow-up</Text>
                <StyledContextValue>{toCleanText(item?.scheduled_at) || 'Not scheduled'}</StyledContextValue>
                <StyledMeta>{`Status: ${status}`}</StyledMeta>
                <StyledShortcutActions>
                  {status === 'SCHEDULED' ? (
                    <Button
                      variant="surface"
                      size="small"
                      disabled={!followUpId || actionDisabled}
                      onPress={() =>
                        runLinkedAction(`follow-up-complete-${followUpId}`, () => completeFollowUp(followUpId))
                      }
                    >
                      Complete
                    </Button>
                  ) : null}
                  {status === 'SCHEDULED' ? (
                    <Button
                      variant="surface"
                      size="small"
                      disabled={!followUpId || actionDisabled}
                      onPress={() =>
                        runLinkedAction(`follow-up-cancel-${followUpId}`, () => cancelFollowUp(followUpId))
                      }
                    >
                      Cancel
                    </Button>
                  ) : null}
                </StyledShortcutActions>
              </StyledContextCard>
            );
          })}

          {carePlans.slice(0, 4).map((item) => (
            <StyledContextCard key={`care-plan-${resolvePublicRecordId(item) || item?.plan}`}>
              <Text variant="label">Care Plan</Text>
              <StyledContextValue>{toCleanText(item?.plan) || 'No plan text'}</StyledContextValue>
              <StyledMeta>{`Start: ${toCleanText(item?.start_date) || 'N/A'}`}</StyledMeta>
            </StyledContextCard>
          ))}
        </StyledContextGrid>
      </>
    );
  };

  const renderEmergencyOperations = () => {
    if (!isEmergencyMode) return null;

    const activeTrip = trips.find((item) => !toCleanText(item?.ended_at));
    const activeTripDisplayId =
      toPublicIdText(activeTrip?.display_id) ||
      toPublicIdText(activeTrip?.human_friendly_id) ||
      '';

    return (
      <Card variant="outlined" testID="emergency-workbench-operations">
        <StyledSectionTitle>Emergency Operations</StyledSectionTitle>
        <StyledMeta>
          {`Case: ${activeEmergencyCaseId || t('common.notAvailable')}`}
        </StyledMeta>
        {activeAdmissionId ? (
          <StyledInlineActions>
            <Badge variant="success" size="small">
              {`Admission ${activeAdmissionId}`}
            </Badge>
            <Button
              variant="surface"
              size="small"
              onPress={screen.onOpenLinkedAdmission}
            >
              Open IPD Handoff
            </Button>
          </StyledInlineActions>
        ) : null}

        {emergencySectionError ? (
          <Text variant="caption">{emergencySectionError}</Text>
        ) : null}
        {isEmergencySectionLoading ? (
          <Text variant="caption">{t('common.loading')}</Text>
        ) : null}

        <StyledForm>
          <TextArea
            label="Response note"
            value={responseDraft.notes}
            onChangeText={(value) =>
              setResponseDraft((previous) => ({ ...previous, notes: value }))
            }
          />
          <Button
            variant="surface"
            size="small"
            onPress={handleCreateEmergencyResponse}
            disabled={
              !activeEmergencyCaseId ||
              !screen.canMutate ||
              Boolean(emergencyActionBusy)
            }
          >
            Add Response
          </Button>
        </StyledForm>

        <StyledFieldRow>
          <TextField
            label="Fleet search"
            value={fleetSearchText}
            onChangeText={setFleetSearchText}
            density="compact"
          />
          <Select
            label="Ambulance"
            value={dispatchDraft.ambulance_id}
            options={ambulanceOptions}
            onValueChange={(value) => {
              setDispatchDraft((previous) => ({ ...previous, ambulance_id: value }));
              setTripDraft((previous) => ({ ...previous, ambulance_id: value }));
            }}
            compact
            searchable
          />
        </StyledFieldRow>
        <StyledInlineActions>
          <Button
            variant="surface"
            size="small"
            onPress={handleCreateDispatch}
            disabled={
              !activeEmergencyCaseId ||
              !dispatchDraft.ambulance_id ||
              !screen.canMutate ||
              Boolean(emergencyActionBusy)
            }
          >
            Dispatch Ambulance
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={handleStartTrip}
            disabled={
              !activeEmergencyCaseId ||
              !dispatchDraft.ambulance_id ||
              !screen.canMutate ||
              Boolean(emergencyActionBusy)
            }
          >
            Start Trip
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={handleEndTrip}
            disabled={
              !activeTripDisplayId ||
              !screen.canMutate ||
              Boolean(emergencyActionBusy)
            }
          >
            End Trip
          </Button>
        </StyledInlineActions>

        <StyledCardGrid>
          <StyledLinkedRecordItem>
            <StyledLinkedRecordLabel>Responses</StyledLinkedRecordLabel>
            <StyledLinkedRecordValue>
              {String(emergencyResponses.length)}
            </StyledLinkedRecordValue>
          </StyledLinkedRecordItem>
          <StyledLinkedRecordItem>
            <StyledLinkedRecordLabel>Dispatches</StyledLinkedRecordLabel>
            <StyledLinkedRecordValue>{String(dispatches.length)}</StyledLinkedRecordValue>
          </StyledLinkedRecordItem>
          <StyledLinkedRecordItem>
            <StyledLinkedRecordLabel>Trips</StyledLinkedRecordLabel>
            <StyledLinkedRecordValue>{String(trips.length)}</StyledLinkedRecordValue>
          </StyledLinkedRecordItem>
          <StyledLinkedRecordItem>
            <StyledLinkedRecordLabel>Active Trip</StyledLinkedRecordLabel>
            <StyledLinkedRecordValue>
              {activeTripDisplayId || t('common.notAvailable')}
            </StyledLinkedRecordValue>
          </StyledLinkedRecordItem>
        </StyledCardGrid>

        {emergencyResponses.length === 0 && dispatches.length === 0 && trips.length === 0 ? (
          <EmptyState
            title="No emergency activity yet"
            description="Add a response note, dispatch an ambulance, or start a trip."
          />
        ) : null}
      </Card>
    );
  };

  const renderCorrectionDialog = () => (
    <Modal
      visible={isCorrectionDialogOpen}
      onDismiss={handleCloseCorrectionDialog}
      size="medium"
      accessibilityLabel={t('scheduling.opdFlow.correction.title')}
      testID="opd-workbench-correction-modal"
    >
      <StyledModalBody>
        <Text variant="label">{t('scheduling.opdFlow.correction.title')}</Text>
        <Select
          label={t('scheduling.opdFlow.correction.targetStage')}
          value={correctionDraft.stage_to}
          options={correctionStageOptions}
          onValueChange={(value) => handleStageCorrectionDraftChange('stage_to', value)}
          compact
          searchable
          testID="opd-workbench-correction-stage-select"
        />
        <TextArea
          label={t('scheduling.opdFlow.correction.reason')}
          value={correctionDraft.reason}
          onChangeText={(value) => handleStageCorrectionDraftChange('reason', value)}
          helperText={t('scheduling.opdFlow.correction.reasonHint')}
          testID="opd-workbench-correction-reason"
        />
        {screen.formError ? <Text variant="caption">{screen.formError}</Text> : null}
        <StyledInlineActions>
          <Button
            variant="surface"
            size="small"
            onPress={handleCloseCorrectionDialog}
            testID="opd-workbench-correction-cancel"
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="primary"
            size="small"
            onPress={handleCorrectStage}
            disabled={!screen.canMutate || !canCorrectStage}
            testID="opd-workbench-correction-submit"
          >
            {t('scheduling.opdFlow.actions.applyProgressEdit')}
          </Button>
        </StyledInlineActions>
      </StyledModalBody>
    </Modal>
  );

  return (
    <StyledContainer testID="opd-workbench-screen">
      <StyledWorkbenchHeader>
        <StyledWorkbenchHeading>
          <StyledWorkbenchTitle>{workbenchTitle}</StyledWorkbenchTitle>
          <StyledWorkbenchDescription>{workbenchDescription}</StyledWorkbenchDescription>
        </StyledWorkbenchHeading>
        <Button
          variant="surface"
          size="small"
          onPress={screen.onRetry}
          icon={<Icon glyph={'\u21bb'} size="xs" decorative />}
          testID="opd-workbench-refresh"
        >
          {t('common.retry')}
        </Button>
      </StyledWorkbenchHeader>

      {screen.isLoading ? (
        <LoadingSpinner accessibilityLabel={t('common.loading')} testID="opd-workbench-loading" />
      ) : null}

      {!screen.isLoading && screen.isEntitlementBlocked ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title={t('scheduling.opdFlow.states.entitlementBlockedTitle')}
          description={t('scheduling.opdFlow.states.entitlementBlockedDescription')}
          action={
            <Button
              variant="surface"
              size="small"
              onPress={screen.onOpenSubscriptions}
              icon={<Icon glyph={'\u2699'} size="xs" decorative />}
            >
              {t('scheduling.opdFlow.states.entitlementBlockedCta')}
            </Button>
          }
          testID="opd-workbench-entitlement-blocked"
        />
      ) : null}

      {!screen.isLoading && !screen.isEntitlementBlocked && screen.isAccessDenied ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title={t('scheduling.opdFlow.states.accessDeniedTitle')}
          description={screen.errorMessage}
          testID="opd-workbench-access-denied"
        />
      ) : null}

      {!screen.isLoading && !screen.isEntitlementBlocked && !screen.isAccessDenied && screen.hasError ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title={t('scheduling.opdFlow.states.loadErrorTitle')}
          description={screen.errorMessage}
          testID="opd-workbench-error"
        />
      ) : null}

      {!screen.isLoading ? (
        <OfflineState
          size={OfflineStateSizes.SMALL}
          title={t('shell.banners.offline.title')}
          description={t('scheduling.opdFlow.states.offlineNotice')}
          testID="opd-workbench-offline-banner"
          style={{ display: screen.isOffline ? 'block' : 'none' }}
        />
      ) : null}

      {!screen.isLoading && !screen.isEntitlementBlocked && !screen.isAccessDenied ? (
        <StyledLayout>
          <StyledPanel>
            <Card variant="outlined">
              <StyledPanelHeader>
                <StyledSectionTitle>{t('scheduling.opdFlow.list.title')}</StyledSectionTitle>
                <Button
                  variant="surface"
                  size="small"
                  onPress={() => screen.setIsStartFormOpen(!screen.isStartFormOpen)}
                  disabled={!screen.canStartFlow || !screen.canMutate}
                  icon={<Icon glyph="+" size="xs" decorative />}
                  testID="opd-workbench-toggle-start-form"
                >
                  {t('scheduling.opdFlow.actions.startFlow')}
                </Button>
              </StyledPanelHeader>
              <StyledMeta>
                {t('scheduling.opdFlow.list.count', { count: screen.flowList.length })}
              </StyledMeta>
              <StyledFlowListSearch>
                <TextField
                  label={t('scheduling.opdFlow.list.searchLabel')}
                  value={screen.flowSearchText}
                  onChangeText={screen.onFlowSearchChange}
                  placeholder={t('scheduling.opdFlow.list.searchPlaceholder')}
                  density="compact"
                  type="search"
                  testID="opd-workbench-flow-search"
                />
                <Select
                  label={isClinicalMode ? 'Queue Scope' : 'Queue Scope'}
                  value={screen.queueScope}
                  options={queueScopeOptions}
                  onValueChange={screen.onQueueScopeChange}
                  compact
                  testID="opd-workbench-queue-scope"
                />
                {screen.isFlowSearchLoading ? (
                  <StyledMeta testID="opd-workbench-flow-search-loading">
                    {t('common.loading')}
                  </StyledMeta>
                ) : null}
              </StyledFlowListSearch>
            </Card>

            {screen.isStartFormOpen ? renderStartForm() : null}

            <Card variant="outlined">
              {screen.flowList.length === 0 ? (
                <EmptyState
                  title={t('scheduling.opdFlow.states.emptyTitle')}
                  description={t('scheduling.opdFlow.states.emptyDescription')}
                  testID="opd-workbench-empty-list"
                />
              ) : (
                <StyledFlowList>
                  {screen.flowList.map((flowItem, index) => {
                    const flowId = toPublicIdText(
                      flowItem?.human_friendly_id ||
                        flowItem?.encounter?.human_friendly_id
                    );
                    const stage = flowItem?.stage || flowItem?.flow?.stage || '';
                    const isSelected = screen.selectedFlowId === flowId;
                    const isSelectable = Boolean(flowId);
                    const encounterHumanFriendlyId = toPublicIdText(
                      flowItem?.encounter?.human_friendly_id ||
                        flowItem?.human_friendly_id
                    );
                    const fallbackTitle = encounterHumanFriendlyId
                      ? t('scheduling.opdFlow.list.itemTitle', { id: encounterHumanFriendlyId })
                      : t('scheduling.opdFlow.list.unknownFlow');
                    const patientName = resolvePatientName(flowItem, fallbackTitle);
                    const patientHumanFriendlyId = resolvePatientHumanFriendlyId(flowItem);
                    const stageLabel = stage
                      ? t(`scheduling.opdFlow.stages.${stage}`)
                      : t('scheduling.opdFlow.stages.UNKNOWN');
                    const phaseTone = resolveFlowPhase(stage);
                    const progressIndex = resolveFlowProgressIndex(stage);

                    return (
                      <StyledFlowListItem
                        key={flowId || `opd-flow-item-${index + 1}`}
                        onPress={() => isSelectable && screen.onSelectFlow(flowItem)}
                        $selected={isSelected}
                        $tone={phaseTone}
                        disabled={!isSelectable}
                        accessibilityRole="button"
                        accessibilityLabel={patientName}
                        accessibilityState={{ selected: isSelected, disabled: !isSelectable }}
                        testID={`opd-workbench-list-item-${index + 1}`}
                      >
                        <StyledFlowListItemHeader>
                          <StyledFlowListNumber $tone={phaseTone}>{index + 1}</StyledFlowListNumber>
                          <StyledFlowListPrimary>
                            <StyledFlowListTitle $selected={isSelected}>
                              {patientName}
                            </StyledFlowListTitle>
                          </StyledFlowListPrimary>
                          <StyledFlowListBadgeWrap>
                            <StyledFlowStageChip
                              $tone={phaseTone}
                              testID={`opd-workbench-list-stage-${index + 1}`}
                            >
                              {stageLabel}
                            </StyledFlowStageChip>
                          </StyledFlowListBadgeWrap>
                        </StyledFlowListItemHeader>
                        <StyledFlowListMetaRow>
                          <StyledFlowListMetaGroup>
                            <StyledFlowListPatientMeta>
                              {`${t('scheduling.opdFlow.start.patientId')}: ${
                                patientHumanFriendlyId || t('common.notAvailable')
                              }`}
                            </StyledFlowListPatientMeta>
                            <StyledFlowListEncounterMeta>
                              {`\u2022 ${t('scheduling.opdFlow.snapshot.encounterId')}: ${
                                encounterHumanFriendlyId || t('common.notAvailable')
                              }`}
                            </StyledFlowListEncounterMeta>
                          </StyledFlowListMetaGroup>
                          <StyledFlowListProgress testID={`opd-workbench-list-progress-${index + 1}`}>
                            {Array.from({ length: FLOW_PROGRESS_DOT_COUNT }).map((_, stepIndex) => {
                              let state = 'upcoming';
                              if (progressIndex >= 0 && stepIndex < progressIndex) {
                                state = 'completed';
                              } else if (progressIndex >= 0 && stepIndex === progressIndex) {
                                state = 'current';
                              }
                              return (
                                <StyledFlowListProgressDot
                                  key={`progress-dot-${index + 1}-${stepIndex + 1}`}
                                  $state={state}
                                  $tone={phaseTone}
                                />
                              );
                            })}
                          </StyledFlowListProgress>
                        </StyledFlowListMetaRow>
                      </StyledFlowListItem>
                    );
                  })}
                </StyledFlowList>
              )}
            </Card>
          </StyledPanel>

          <StyledPanel>
            <Card variant="outlined">
              <StyledPanelHeader>
                <StyledSectionTitle>{t('scheduling.opdFlow.snapshot.title')}</StyledSectionTitle>
                <StyledInlineActions>
                  <Text variant="caption" testID="opd-workbench-stage-label">
                    {activeStage ? t(screen.stageLabelKey) : t('scheduling.opdFlow.stages.UNKNOWN')}
                  </Text>
                  {screen.isSelectedFlowLoading ? (
                    <Text variant="caption" testID="opd-workbench-selected-flow-loading">
                      {t('common.loading')}
                    </Text>
                  ) : null}
                  {canCorrectStage && activeFlow ? (
                    <Button
                      variant="surface"
                      size="small"
                      onPress={handleOpenCorrectionDialog}
                      disabled={!screen.canMutate}
                      testID="opd-workbench-open-correction-dialog"
                    >
                      {t('scheduling.opdFlow.actions.editProgress')}
                    </Button>
                  ) : null}
                </StyledInlineActions>
              </StyledPanelHeader>

              <StyledSectionTitle>{t('scheduling.opdFlow.progress.title')}</StyledSectionTitle>
              <StyledProgressTracker>
                {screen.progressSteps.map((step, index) => (
                  <StyledProgressStep key={step.id} $status={step.status} $tone={step.tone}>
                    <StyledProgressStepIndex $status={step.status}>{index + 1}</StyledProgressStepIndex>
                    <StyledProgressDot $status={step.status} $tone={step.tone} />
                    {t(step.labelKey)}
                  </StyledProgressStep>
                ))}
              </StyledProgressTracker>

              {activeFlow ? (
                <StyledCardGrid>
                  {renderLinkedId(
                    t,
                    t('scheduling.opdFlow.snapshot.encounterId'),
                    linkedIds.encounter_id
                  )}
                  {renderLinkedId(
                    t,
                    t('scheduling.opdFlow.snapshot.queueId'),
                    linkedIds.visit_queue_id
                  )}
                  {renderLinkedId(
                    t,
                    t('scheduling.opdFlow.snapshot.appointmentId'),
                    linkedIds.appointment_id
                  )}
                  {renderLinkedId(
                    t,
                    t('scheduling.opdFlow.snapshot.invoiceId'),
                    linkedIds.consultation_invoice_id
                  )}
                  {renderLinkedId(
                    t,
                    t('scheduling.opdFlow.snapshot.paymentId'),
                    linkedIds.consultation_payment_id
                  )}
                  {renderLinkedId(
                    t,
                    t('scheduling.opdFlow.snapshot.emergencyCaseId'),
                    linkedIds.emergency_case_id
                  )}
                  {renderLinkedId(
                    t,
                    t('scheduling.opdFlow.snapshot.triageAssessmentId'),
                    linkedIds.triage_assessment_id
                  )}
                  {renderLinkedId(
                    t,
                    t('scheduling.opdFlow.snapshot.labOrderIds'),
                    linkedIds.lab_order_ids || []
                  )}
                  {renderLinkedId(
                    t,
                    t('scheduling.opdFlow.snapshot.radiologyOrderIds'),
                    linkedIds.radiology_order_ids || []
                  )}
                  {renderLinkedId(
                    t,
                    t('scheduling.opdFlow.snapshot.pharmacyOrderId'),
                    linkedIds.pharmacy_order_id
                  )}
                  {renderLinkedId(
                    t,
                    t('scheduling.opdFlow.snapshot.admissionId'),
                    linkedIds.admission_id
                  )}
                </StyledCardGrid>
              ) : (
                <EmptyState
                  title={t('scheduling.opdFlow.states.noSelection')}
                  description={t('scheduling.opdFlow.states.selectFlow')}
                  testID="opd-workbench-snapshot-empty"
                />
              )}
            </Card>

            <Card variant="outlined">
              <StyledSectionTitle>{t('scheduling.opdFlow.timeline.title')}</StyledSectionTitle>
              {screen.timeline.length === 0 ? (
                <EmptyState
                  title={t('scheduling.opdFlow.timeline.emptyTitle')}
                  description={t('scheduling.opdFlow.timeline.emptyDescription')}
                  testID="opd-workbench-timeline-empty"
                />
              ) : (
                <StyledTimeline>
                  {screen.timelineItems.map((event, index) => (
                    <StyledTimelineItem key={`${event.event}-${event.at}-${index + 1}`}>
                      {event.label || t('scheduling.opdFlow.timeline.eventUnknown')}
                      {' | '}
                      {event.timestampLabel}
                      {event.relativeLabel ? (
                        <>
                          {' '}
                          <StyledTimelineMeta>({event.relativeLabel})</StyledTimelineMeta>
                        </>
                      ) : null}
                    </StyledTimelineItem>
                  ))}
                </StyledTimeline>
              )}
            </Card>

            <Card variant="outlined">
              <StyledSectionTitle>{t('scheduling.opdFlow.guidance.title')}</StyledSectionTitle>
              <Text variant="body">{t(screen.currentActionGuidanceKey)}</Text>
              {screen.currentActionRequirementKeys.length > 0 ? (
                <StyledGuidanceList>
                  {screen.currentActionRequirementKeys.map((requirementKey) => (
                    <li key={requirementKey}>{t(requirementKey)}</li>
                  ))}
                </StyledGuidanceList>
              ) : null}
            </Card>

            <Card variant="outlined">
              <StyledSectionTitle>{t('scheduling.opdFlow.actions.currentStep')}</StyledSectionTitle>
              {renderActionSection()}
            </Card>

            {isEmergencyMode ? renderEmergencyOperations() : null}

            {isClinicalMode ? (
              <Card variant="outlined">
                <StyledSectionTitle>Clinical Modules</StyledSectionTitle>
                {renderClinicalModuleLinks()}
                <StyledSectionTitle>Linked Records</StyledSectionTitle>
                {renderLinkedClinicalRecords()}
              </Card>
            ) : null}
          </StyledPanel>
        </StyledLayout>
      ) : null}
      {renderCorrectionDialog()}
    </StyledContainer>
  );
};

export default OpdFlowWorkbenchScreen;
