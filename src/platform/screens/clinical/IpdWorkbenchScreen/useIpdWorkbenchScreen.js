import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SCOPE_KEYS } from '@config/accessPolicy';
import {
  useAuth,
  useBed,
  useI18n,
  useIpdFlow,
  useNetwork,
  useRealtimeEvent,
  useScopeAccess,
  useWard,
} from '@hooks';

const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const normalizeScalarParam = (value) => {
  if (Array.isArray(value)) return String(value[0] || '').trim();
  return String(value || '').trim();
};

const sanitizeString = (value) => String(value || '').trim();
const isUuidLike = (value) => UUID_LIKE_REGEX.test(sanitizeString(value));
const toIsoDateTime = (value) => {
  const normalized = sanitizeString(value);
  if (!normalized) return undefined;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
};
const toLocalDateTimeInput = (date = new Date()) => {
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  const yyyy = parsed.getFullYear();
  const mm = String(parsed.getMonth() + 1).padStart(2, '0');
  const dd = String(parsed.getDate()).padStart(2, '0');
  const hh = String(parsed.getHours()).padStart(2, '0');
  const min = String(parsed.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};
const resolveListItems = (result) => {
  if (Array.isArray(result)) return result;
  if (result && typeof result === 'object' && Array.isArray(result.items)) return result.items;
  return [];
};
const resolvePagination = (result) =>
  result && typeof result === 'object' && result.pagination ? result.pagination : null;

const resolveAdmissionIdentifier = (snapshot) =>
  sanitizeString(snapshot?.human_friendly_id || snapshot?.display_id || snapshot?.id);

const resolvePatientLabel = (snapshot) => {
  const patient = snapshot?.patient || {};
  const fullName = [sanitizeString(patient.first_name), sanitizeString(patient.last_name)]
    .filter(Boolean)
    .join(' ');
  if (fullName) return fullName;
  return sanitizeString(snapshot?.patient_display_id) || 'Unknown patient';
};

const STAGE_OPTIONS = [
  '',
  'ADMITTED_PENDING_BED',
  'ADMITTED_IN_BED',
  'TRANSFER_REQUESTED',
  'TRANSFER_IN_PROGRESS',
  'DISCHARGE_PLANNED',
  'DISCHARGED',
  'CANCELLED',
];

const TRANSFER_STATUS_OPTIONS = ['', 'REQUESTED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const HAS_ACTIVE_BED_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'true', label: 'In bed' },
  { value: 'false', label: 'No bed' },
];
const TRANSFER_ACTION_OPTIONS = ['APPROVE', 'START', 'COMPLETE', 'CANCEL'];
const MEDICATION_ROUTE_OPTIONS = ['ORAL', 'IV', 'IM', 'TOPICAL', 'INHALATION', 'OTHER'];

const DEFAULT_START_DRAFT = {
  patient_id: '',
  encounter_id: '',
  bed_id: '',
  admitted_at: '',
};
const DEFAULT_ASSIGN_BED_DRAFT = { bed_id: '' };
const DEFAULT_TRANSFER_DRAFT = {
  from_ward_id: '',
  to_ward_id: '',
  transfer_request_id: '',
  action: 'APPROVE',
  to_bed_id: '',
};
const DEFAULT_WARD_ROUND_DRAFT = { notes: '', round_at: '' };
const DEFAULT_NURSING_DRAFT = { nurse_user_id: '', note: '' };
const DEFAULT_MEDICATION_DRAFT = {
  dose: '',
  unit: '',
  route: 'ORAL',
  administered_at: toLocalDateTimeInput(),
};
const DEFAULT_DISCHARGE_DRAFT = {
  summary: '',
  discharged_at: toLocalDateTimeInput(),
};

const useIpdWorkbenchScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const { user } = useAuth();
  const {
    canRead,
    canWrite,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  } = useScopeAccess(SCOPE_KEYS.IPD);

  const {
    list,
    get,
    start,
    assignBed,
    releaseBed,
    requestTransfer,
    updateTransfer,
    addWardRound,
    addNursingNote,
    addMedicationAdministration,
    planDischarge,
    finalizeDischarge,
    reset,
    isLoading: isCrudLoading,
    errorCode,
  } = useIpdFlow();

  const { list: listWards } = useWard();
  const { list: listBeds } = useBed();

  const [flowList, setFlowList] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [selectedFlowId, setSelectedFlowId] = useState('');
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [wardFilter, setWardFilter] = useState('');
  const [transferStatusFilter, setTransferStatusFilter] = useState('');
  const [hasActiveBedFilter, setHasActiveBedFilter] = useState('');
  const [isListLoading, setIsListLoading] = useState(false);
  const [isSelectedSnapshotLoading, setIsSelectedSnapshotLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [isStartFormOpen, setIsStartFormOpen] = useState(false);
  const [startDraft, setStartDraft] = useState(DEFAULT_START_DRAFT);
  const [assignBedDraft, setAssignBedDraft] = useState(DEFAULT_ASSIGN_BED_DRAFT);
  const [transferDraft, setTransferDraft] = useState(DEFAULT_TRANSFER_DRAFT);
  const [wardRoundDraft, setWardRoundDraft] = useState(DEFAULT_WARD_ROUND_DRAFT);
  const [nursingDraft, setNursingDraft] = useState(DEFAULT_NURSING_DRAFT);
  const [medicationDraft, setMedicationDraft] = useState(DEFAULT_MEDICATION_DRAFT);
  const [dischargeDraft, setDischargeDraft] = useState(DEFAULT_DISCHARGE_DRAFT);
  const [wardOptions, setWardOptions] = useState([]);
  const [bedOptions, setBedOptions] = useState([]);

  const lastRealtimeRefreshRef = useRef(0);

  const scopeParams = useMemo(() => {
    if (canManageAllTenants) return {};
    const params = {};
    if (sanitizeString(tenantId)) params.tenant_id = sanitizeString(tenantId);
    if (sanitizeString(facilityId)) params.facility_id = sanitizeString(facilityId);
    return params;
  }, [canManageAllTenants, facilityId, tenantId]);

  const canViewWorkbench =
    isResolved && (canRead || canManageAllTenants) && (canManageAllTenants || Boolean(scopeParams.tenant_id));
  const canMutate = canWrite && !isOffline;

  const requestedFlowId = normalizeScalarParam(searchParams?.id);
  const requestedAction = normalizeScalarParam(searchParams?.action).toLowerCase();
  const requestedPatientId = normalizeScalarParam(searchParams?.patientId);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(sanitizeString(searchText));
    }, 280);
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    if (!requestedPatientId) return;
    setStartDraft((previous) => ({
      ...previous,
      patient_id: requestedPatientId,
    }));
  }, [requestedPatientId]);

  useEffect(() => {
    if (requestedAction === 'start_admission') {
      setIsStartFormOpen(true);
    }
  }, [requestedAction]);

  useEffect(() => {
    if (!requestedFlowId) return;
    setSelectedFlowId(requestedFlowId);
  }, [requestedFlowId]);

  useEffect(() => {
    const userIdentifier = sanitizeString(user?.human_friendly_id || user?.id);
    if (!userIdentifier) return;
    setNursingDraft((previous) => {
      if (sanitizeString(previous.nurse_user_id)) return previous;
      return {
        ...previous,
        nurse_user_id: userIdentifier,
      };
    });
  }, [user?.human_friendly_id, user?.id]);

  const syncSelectedFlowUrl = useCallback(
    (flowId) => {
      const normalizedFlowId = sanitizeString(flowId);
      if (!normalizedFlowId) {
        router.replace('/ipd');
        return;
      }

      if (typeof router?.setParams === 'function') {
        try {
          router.setParams({ id: normalizedFlowId });
          return;
        } catch (_error) {
          // Fallback to replace below.
        }
      }

      router.replace(`/ipd?id=${encodeURIComponent(normalizedFlowId)}`);
    },
    [router]
  );

  const upsertFlowInList = useCallback((snapshot) => {
    const snapshotId = resolveAdmissionIdentifier(snapshot);
    if (!snapshotId) return;

    setFlowList((previous) => {
      const index = previous.findIndex(
        (item) => resolveAdmissionIdentifier(item).toUpperCase() === snapshotId.toUpperCase()
      );
      if (index < 0) {
        return [snapshot, ...previous];
      }
      const next = [...previous];
      next[index] = snapshot;
      return next;
    });
  }, []);

  const applySnapshot = useCallback(
    (snapshot) => {
      if (!snapshot) return;
      const snapshotId = resolveAdmissionIdentifier(snapshot);
      if (!snapshotId) return;
      setSelectedFlow(snapshot);
      setSelectedFlowId(snapshotId);
      upsertFlowInList(snapshot);
      syncSelectedFlowUrl(snapshotId);
    },
    [syncSelectedFlowUrl, upsertFlowInList]
  );

  const loadReferenceOptions = useCallback(async () => {
    if (!canViewWorkbench || isOffline) return;

    try {
      const [wardsResult, bedsResult] = await Promise.all([
        listWards({ ...scopeParams, limit: 100, sort_by: 'name', order: 'asc' }),
        listBeds({ ...scopeParams, limit: 150, sort_by: 'label', order: 'asc' }),
      ]);

      const wards = resolveListItems(wardsResult)
        .map((ward) => ({
          value: sanitizeString(ward?.human_friendly_id || ward?.id),
          label: sanitizeString(ward?.name) || sanitizeString(ward?.human_friendly_id || ward?.id),
        }))
        .filter((item) => item.value);

      const beds = resolveListItems(bedsResult)
        .filter((bed) => sanitizeString(bed?.status).toUpperCase() === 'AVAILABLE')
        .map((bed) => ({
          value: sanitizeString(bed?.human_friendly_id || bed?.id),
          label:
            sanitizeString(bed?.label) ||
            sanitizeString(bed?.human_friendly_id || bed?.id) ||
            t('common.notAvailable'),
        }))
        .filter((item) => item.value);

      setWardOptions(wards);
      setBedOptions(beds);
    } catch (_error) {
      setWardOptions([]);
      setBedOptions([]);
    }
  }, [canViewWorkbench, isOffline, listBeds, listWards, scopeParams, t]);

  const loadFlowList = useCallback(async () => {
    if (!canViewWorkbench || isOffline) return;

    setIsListLoading(true);
    reset();

    const params = {
      page: 1,
      limit: 40,
      sort_by: 'admitted_at',
      order: 'desc',
      ...scopeParams,
    };

    if (sanitizeString(debouncedSearch)) params.search = sanitizeString(debouncedSearch);
    if (sanitizeString(stageFilter)) params.stage = sanitizeString(stageFilter);
    if (sanitizeString(wardFilter)) params.ward_id = sanitizeString(wardFilter);
    if (sanitizeString(transferStatusFilter)) {
      params.transfer_status = sanitizeString(transferStatusFilter);
    }
    if (sanitizeString(hasActiveBedFilter)) {
      params.has_active_bed = sanitizeString(hasActiveBedFilter) === 'true';
    }

    try {
      const result = await list(params);
      const items = resolveListItems(result);
      setFlowList(items);
      setPagination(resolvePagination(result));

      if (!selectedFlowId && items.length > 0) {
        const firstId = resolveAdmissionIdentifier(items[0]);
        if (firstId) {
          setSelectedFlowId(firstId);
          syncSelectedFlowUrl(firstId);
        }
      }
    } finally {
      setIsListLoading(false);
    }
  }, [
    canViewWorkbench,
    debouncedSearch,
    hasActiveBedFilter,
    isOffline,
    list,
    reset,
    scopeParams,
    selectedFlowId,
    stageFilter,
    syncSelectedFlowUrl,
    transferStatusFilter,
    wardFilter,
  ]);

  const loadSelectedFlow = useCallback(async () => {
    if (!canViewWorkbench || isOffline) return;
    if (!sanitizeString(selectedFlowId)) {
      setSelectedFlow(null);
      return;
    }

    setIsSelectedSnapshotLoading(true);
    try {
      const snapshot = await get(selectedFlowId);
      if (snapshot) {
        setSelectedFlow(snapshot);
        upsertFlowInList(snapshot);
      }
    } finally {
      setIsSelectedSnapshotLoading(false);
    }
  }, [canViewWorkbench, get, isOffline, selectedFlowId, upsertFlowInList]);

  useEffect(() => {
    loadReferenceOptions();
  }, [loadReferenceOptions]);

  useEffect(() => {
    loadFlowList();
  }, [loadFlowList]);

  useEffect(() => {
    loadSelectedFlow();
  }, [loadSelectedFlow]);

  useEffect(() => {
    if (!selectedFlow) return;

    const currentWardIdentifier =
      sanitizeString(selectedFlow?.active_bed_assignment?.bed?.ward?.human_friendly_id) ||
      sanitizeString(selectedFlow?.active_bed_assignment?.bed?.ward?.id) ||
      '';

    const plannedDischargeSummary = selectedFlow?.latest_discharge_summary || null;

    setTransferDraft((previous) => ({
      ...previous,
      from_ward_id: currentWardIdentifier || previous.from_ward_id,
    }));

    if (sanitizeString(plannedDischargeSummary?.status).toUpperCase() === 'PLANNED') {
      setDischargeDraft((previous) => ({
        ...previous,
        summary: sanitizeString(previous.summary) || sanitizeString(plannedDischargeSummary.summary),
        discharged_at:
          sanitizeString(previous.discharged_at) ||
          toLocalDateTimeInput(plannedDischargeSummary.discharged_at || new Date()),
      }));
    }
  }, [selectedFlow]);

  const refreshFromRealtimeEvent = useCallback(
    (admissionIdentifier = '') => {
      const now = Date.now();
      if (now - lastRealtimeRefreshRef.current < 750) return;
      lastRealtimeRefreshRef.current = now;

      const normalizedEventId = sanitizeString(admissionIdentifier).toUpperCase();
      const selectedCandidates = [
        sanitizeString(selectedFlowId),
        sanitizeString(selectedFlow?.human_friendly_id),
        sanitizeString(selectedFlow?.id),
      ]
        .filter(Boolean)
        .map((value) => value.toUpperCase());

      if (normalizedEventId && selectedCandidates.includes(normalizedEventId)) {
        loadSelectedFlow();
        return;
      }

      loadFlowList();
    },
    [loadFlowList, loadSelectedFlow, selectedFlow, selectedFlowId]
  );

  const handleRealtimeUpdate = useCallback(
    (payload = {}) => {
      const admissionIdentifier =
        sanitizeString(payload?.admission_public_id) || sanitizeString(payload?.admission_id);
      refreshFromRealtimeEvent(admissionIdentifier);
    },
    [refreshFromRealtimeEvent]
  );

  useRealtimeEvent('ipd.flow.updated', handleRealtimeUpdate, {
    enabled: canViewWorkbench && !isOffline,
  });
  useRealtimeEvent('admission.patient_admitted', handleRealtimeUpdate, {
    enabled: canViewWorkbench && !isOffline,
  });
  useRealtimeEvent('admission.patient_transferred', handleRealtimeUpdate, {
    enabled: canViewWorkbench && !isOffline,
  });
  useRealtimeEvent('admission.patient_discharged', handleRealtimeUpdate, {
    enabled: canViewWorkbench && !isOffline,
  });
  useRealtimeEvent('admission.bed_assignment_changed', handleRealtimeUpdate, {
    enabled: canViewWorkbench && !isOffline,
  });

  const runMutation = useCallback(
    async (work) => {
      if (!canMutate) {
        setFormError(t('ipd.workbench.errors.readOnly'));
        return null;
      }

      setFormError('');
      const result = await work();
      if (!result) {
        setFormError(t('ipd.workbench.errors.actionFailed'));
        return null;
      }

      applySnapshot(result);
      return result;
    },
    [applySnapshot, canMutate, t]
  );

  const onStartDraftChange = useCallback((field, value) => {
    setStartDraft((previous) => ({
      ...previous,
      [field]: value,
    }));
  }, []);

  const onStartAdmission = useCallback(async () => {
    const patientId = sanitizeString(startDraft.patient_id);
    if (!patientId) {
      setFormError(t('ipd.workbench.validation.patientRequired'));
      return;
    }

    const payload = {
      patient_id: patientId,
      encounter_id: sanitizeString(startDraft.encounter_id) || undefined,
      bed_id: sanitizeString(startDraft.bed_id) || undefined,
      admitted_at: toIsoDateTime(startDraft.admitted_at),
      ...scopeParams,
    };

    const result = await runMutation(() => start(payload));
    if (result) {
      setIsStartFormOpen(false);
      setStartDraft((previous) => ({
        ...previous,
        encounter_id: '',
        bed_id: '',
      }));
      loadFlowList();
      loadReferenceOptions();
    }
  }, [loadFlowList, loadReferenceOptions, runMutation, scopeParams, start, startDraft, t]);

  const onAssignBed = useCallback(async () => {
    const admissionId = sanitizeString(selectedFlowId);
    const bedId = sanitizeString(assignBedDraft.bed_id);
    if (!admissionId) return;
    if (!bedId) {
      setFormError(t('ipd.workbench.validation.bedRequired'));
      return;
    }

    const result = await runMutation(() => assignBed(admissionId, { bed_id: bedId }));
    if (result) {
      setAssignBedDraft(DEFAULT_ASSIGN_BED_DRAFT);
      loadReferenceOptions();
    }
  }, [assignBed, assignBedDraft.bed_id, loadReferenceOptions, runMutation, selectedFlowId, t]);

  const onReleaseBed = useCallback(async () => {
    const admissionId = sanitizeString(selectedFlowId);
    if (!admissionId) return;
    const result = await runMutation(() => releaseBed(admissionId, {}));
    if (result) loadReferenceOptions();
  }, [loadReferenceOptions, releaseBed, runMutation, selectedFlowId]);

  const onTransferDraftChange = useCallback((field, value) => {
    setTransferDraft((previous) => ({
      ...previous,
      [field]: value,
    }));
  }, []);

  const onRequestTransfer = useCallback(async () => {
    const admissionId = sanitizeString(selectedFlowId);
    if (!admissionId) return;

    const toWardId = sanitizeString(transferDraft.to_ward_id);
    if (!toWardId) {
      setFormError(t('ipd.workbench.validation.toWardRequired'));
      return;
    }

    await runMutation(() =>
      requestTransfer(admissionId, {
        from_ward_id: sanitizeString(transferDraft.from_ward_id) || undefined,
        to_ward_id: toWardId,
      })
    );
  }, [requestTransfer, runMutation, selectedFlowId, t, transferDraft.from_ward_id, transferDraft.to_ward_id]);

  const onUpdateTransfer = useCallback(async () => {
    const admissionId = sanitizeString(selectedFlowId);
    if (!admissionId) return;

    const action = sanitizeString(transferDraft.action).toUpperCase();
    if (!action) {
      setFormError(t('ipd.workbench.validation.transferActionRequired'));
      return;
    }

    if (action === 'COMPLETE' && !sanitizeString(transferDraft.to_bed_id)) {
      setFormError(t('ipd.workbench.validation.transferBedRequired'));
      return;
    }

    await runMutation(() =>
      updateTransfer(admissionId, {
        action,
        transfer_request_id: sanitizeString(transferDraft.transfer_request_id) || undefined,
        to_bed_id: sanitizeString(transferDraft.to_bed_id) || undefined,
      })
    );
  }, [runMutation, selectedFlowId, t, transferDraft.action, transferDraft.to_bed_id, transferDraft.transfer_request_id, updateTransfer]);

  const onWardRoundDraftChange = useCallback((field, value) => {
    setWardRoundDraft((previous) => ({
      ...previous,
      [field]: value,
    }));
  }, []);

  const onAddWardRound = useCallback(async () => {
    const admissionId = sanitizeString(selectedFlowId);
    if (!admissionId) return;

    const result = await runMutation(() =>
      addWardRound(admissionId, {
        notes: sanitizeString(wardRoundDraft.notes) || undefined,
        round_at: toIsoDateTime(wardRoundDraft.round_at),
      })
    );

    if (result) {
      setWardRoundDraft(DEFAULT_WARD_ROUND_DRAFT);
    }
  }, [addWardRound, runMutation, selectedFlowId, wardRoundDraft.notes, wardRoundDraft.round_at]);

  const onNursingDraftChange = useCallback((field, value) => {
    setNursingDraft((previous) => ({
      ...previous,
      [field]: value,
    }));
  }, []);

  const onAddNursingNote = useCallback(async () => {
    const admissionId = sanitizeString(selectedFlowId);
    if (!admissionId) return;

    const note = sanitizeString(nursingDraft.note);
    if (!note) {
      setFormError(t('ipd.workbench.validation.nursingNoteRequired'));
      return;
    }

    const result = await runMutation(() =>
      addNursingNote(admissionId, {
        note,
        nurse_user_id: sanitizeString(nursingDraft.nurse_user_id) || undefined,
      })
    );

    if (result) {
      setNursingDraft((previous) => ({
        ...previous,
        note: '',
      }));
    }
  }, [addNursingNote, nursingDraft.note, nursingDraft.nurse_user_id, runMutation, selectedFlowId, t]);

  const onMedicationDraftChange = useCallback((field, value) => {
    setMedicationDraft((previous) => ({
      ...previous,
      [field]: value,
    }));
  }, []);

  const onAddMedicationAdministration = useCallback(async () => {
    const admissionId = sanitizeString(selectedFlowId);
    if (!admissionId) return;

    const dose = sanitizeString(medicationDraft.dose);
    if (!dose) {
      setFormError(t('ipd.workbench.validation.medicationDoseRequired'));
      return;
    }

    const result = await runMutation(() =>
      addMedicationAdministration(admissionId, {
        dose,
        unit: sanitizeString(medicationDraft.unit) || undefined,
        route: sanitizeString(medicationDraft.route) || 'ORAL',
        administered_at: toIsoDateTime(medicationDraft.administered_at),
      })
    );

    if (result) {
      setMedicationDraft((previous) => ({
        ...DEFAULT_MEDICATION_DRAFT,
        route: previous.route || 'ORAL',
        administered_at: toLocalDateTimeInput(),
      }));
    }
  }, [
    addMedicationAdministration,
    medicationDraft.administered_at,
    medicationDraft.dose,
    medicationDraft.route,
    medicationDraft.unit,
    runMutation,
    selectedFlowId,
    t,
  ]);

  const onDischargeDraftChange = useCallback((field, value) => {
    setDischargeDraft((previous) => ({
      ...previous,
      [field]: value,
    }));
  }, []);

  const onPlanDischarge = useCallback(async () => {
    const admissionId = sanitizeString(selectedFlowId);
    if (!admissionId) return;

    const summary = sanitizeString(dischargeDraft.summary);
    if (!summary) {
      setFormError(t('ipd.workbench.validation.dischargeSummaryRequired'));
      return;
    }

    await runMutation(() =>
      planDischarge(admissionId, {
        summary,
        discharged_at: toIsoDateTime(dischargeDraft.discharged_at),
      })
    );
  }, [dischargeDraft.discharged_at, dischargeDraft.summary, planDischarge, runMutation, selectedFlowId, t]);

  const onFinalizeDischarge = useCallback(async () => {
    const admissionId = sanitizeString(selectedFlowId);
    if (!admissionId) return;

    await runMutation(() =>
      finalizeDischarge(admissionId, {
        summary: sanitizeString(dischargeDraft.summary) || undefined,
        discharged_at: toIsoDateTime(dischargeDraft.discharged_at),
      })
    );

    loadReferenceOptions();
  }, [dischargeDraft.discharged_at, dischargeDraft.summary, finalizeDischarge, loadReferenceOptions, runMutation, selectedFlowId]);

  const onSelectFlow = useCallback(
    (flow) => {
      const flowIdentifier = resolveAdmissionIdentifier(flow);
      if (!flowIdentifier) return;
      setSelectedFlowId(flowIdentifier);
      setSelectedFlow(flow);
      syncSelectedFlowUrl(flowIdentifier);
    },
    [syncSelectedFlowUrl]
  );

  const timelineItems = useMemo(() => {
    const timeline = Array.isArray(selectedFlow?.timeline) ? selectedFlow.timeline : [];
    return timeline.slice(0, 20).map((entry) => {
      const at = new Date(entry?.at);
      const timestamp = Number.isNaN(at.getTime()) ? sanitizeString(entry?.at) : at.toLocaleString();
      return {
        id: `${sanitizeString(entry?.type)}-${sanitizeString(entry?.at)}`,
        label: sanitizeString(entry?.label) || sanitizeString(entry?.type) || t('common.notAvailable'),
        timestamp,
      };
    });
  }, [selectedFlow?.timeline, t]);

  const stageOptions = useMemo(
    () => STAGE_OPTIONS.map((stage) => ({
      value: stage,
      label: stage ? stage.replace(/_/g, ' ') : t('ipd.workbench.filters.allStages'),
    })),
    [t]
  );

  const transferStatusOptions = useMemo(
    () => TRANSFER_STATUS_OPTIONS.map((status) => ({
      value: status,
      label: status ? status.replace(/_/g, ' ') : t('ipd.workbench.filters.allTransferStates'),
    })),
    [t]
  );

  const hasActiveBedOptions = useMemo(
    () =>
      HAS_ACTIVE_BED_OPTIONS.map((option) => ({
        ...option,
        label:
          option.value === ''
            ? t('ipd.workbench.filters.allBedStates')
            : option.value === 'true'
              ? t('ipd.workbench.filters.hasBed')
              : t('ipd.workbench.filters.noBed'),
      })),
    [t]
  );

  const formattedWardOptions = useMemo(
    () => [{ value: '', label: t('ipd.workbench.filters.allWards') }, ...wardOptions],
    [t, wardOptions]
  );

  const selectedSummary = useMemo(
    () => ({
      admissionId: resolveAdmissionIdentifier(selectedFlow),
      patientName: resolvePatientLabel(selectedFlow),
      patientId: sanitizeString(selectedFlow?.patient_display_id),
      stage: sanitizeString(selectedFlow?.stage || selectedFlow?.flow?.stage),
      nextStep: sanitizeString(selectedFlow?.next_step || selectedFlow?.flow?.next_step),
      activeBed:
        sanitizeString(selectedFlow?.active_bed_assignment?.bed?.label) ||
        sanitizeString(selectedFlow?.active_bed_assignment?.bed?.human_friendly_id),
      activeWard:
        sanitizeString(selectedFlow?.active_bed_assignment?.bed?.ward?.name) ||
        sanitizeString(selectedFlow?.ward_display_name),
      transferStatus:
        sanitizeString(selectedFlow?.open_transfer_request?.status) ||
        sanitizeString(selectedFlow?.transfer_status),
    }),
    [selectedFlow]
  );

  const handleRetry = useCallback(() => {
    if (selectedFlowId) {
      loadSelectedFlow();
    }
    loadFlowList();
    loadReferenceOptions();
  }, [loadFlowList, loadReferenceOptions, loadSelectedFlow, selectedFlowId]);

  const handleClearFilters = useCallback(() => {
    setSearchText('');
    setDebouncedSearch('');
    setStageFilter('');
    setWardFilter('');
    setTransferStatusFilter('');
    setHasActiveBedFilter('');
  }, []);

  return {
    isResolved,
    canViewWorkbench,
    canMutate,
    isOffline,
    isLoading: !isResolved || (isListLoading && flowList.length === 0),
    isListLoading,
    isSelectedSnapshotLoading,
    isCrudLoading,
    hasError: Boolean(errorCode),
    errorCode,
    flowList,
    pagination,
    selectedFlow,
    selectedFlowId,
    selectedSummary,
    timelineItems,
    formError,
    isStartFormOpen,
    startDraft,
    assignBedDraft,
    transferDraft,
    wardRoundDraft,
    nursingDraft,
    medicationDraft,
    dischargeDraft,
    stageFilter,
    wardFilter,
    transferStatusFilter,
    hasActiveBedFilter,
    searchText,
    stageOptions,
    transferStatusOptions,
    hasActiveBedOptions,
    wardOptions: formattedWardOptions,
    bedOptions,
    transferActionOptions: TRANSFER_ACTION_OPTIONS,
    medicationRouteOptions: MEDICATION_ROUTE_OPTIONS,
    setIsStartFormOpen,
    onStartDraftChange,
    onAssignBedDraftChange: (value) =>
      setAssignBedDraft((previous) => ({
        ...previous,
        bed_id: value,
      })),
    onTransferDraftChange,
    onWardRoundDraftChange,
    onNursingDraftChange,
    onMedicationDraftChange,
    onDischargeDraftChange,
    onFlowSearchChange: setSearchText,
    onStageFilterChange: setStageFilter,
    onWardFilterChange: setWardFilter,
    onTransferStatusFilterChange: setTransferStatusFilter,
    onHasActiveBedFilterChange: setHasActiveBedFilter,
    onClearFilters: handleClearFilters,
    onStartAdmission,
    onAssignBed,
    onReleaseBed,
    onRequestTransfer,
    onUpdateTransfer,
    onAddWardRound,
    onAddNursingNote,
    onAddMedicationAdministration,
    onPlanDischarge,
    onFinalizeDischarge,
    onSelectFlow,
    onRetry: handleRetry,
  };
};

export default useIpdWorkbenchScreen;
