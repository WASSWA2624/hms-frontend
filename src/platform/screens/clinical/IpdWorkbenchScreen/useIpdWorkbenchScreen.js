import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SCOPE_KEYS } from '@config/accessPolicy';
import { parseIpdWorkbenchRouteState } from '@features/ipd-flow';
import {
  useAuth,
  useBed,
  useI18n,
  useIpdFlow,
  useNetwork,
  usePatient,
  useRealtimeEvent,
  useScopeAccess,
  useWard,
} from '@hooks';

const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const STAGE_OPTIONS = ['', 'ADMITTED_PENDING_BED', 'ADMITTED_IN_BED', 'TRANSFER_REQUESTED', 'TRANSFER_IN_PROGRESS', 'DISCHARGE_PLANNED', 'DISCHARGED', 'CANCELLED'];
const TRANSFER_STATUS_OPTIONS = ['', 'REQUESTED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const TRANSFER_ACTION_OPTIONS = ['APPROVE', 'START', 'COMPLETE', 'CANCEL'];
const MEDICATION_ROUTE_OPTIONS = ['ORAL', 'IV', 'IM', 'TOPICAL', 'INHALATION', 'OTHER'];
const QUEUE_SCOPE_OPTIONS = [{ value: 'ACTIVE', label: 'Active admissions' }, { value: 'ALL', label: 'All admissions' }];
const TERMINAL_STAGES = new Set(['DISCHARGED', 'CANCELLED']);
const OPEN_TRANSFER_STATUSES = new Set(['REQUESTED', 'APPROVED', 'IN_PROGRESS']);

const sanitize = (value) => String(value || '').trim();
const normalizeScalar = (value) => (Array.isArray(value) ? sanitize(value[0]) : sanitize(value));
const isUuidLike = (value) => UUID_LIKE_REGEX.test(sanitize(value));
const toIdentifier = (value) => sanitize(value);
const toPublic = (value) => {
  const text = sanitize(value);
  if (!text || isUuidLike(text)) return '';
  return text;
};
const toIso = (value) => {
  const text = sanitize(value);
  if (!text) return undefined;
  const parsed = new Date(text);
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
const resolveItems = (result) => (Array.isArray(result?.items) ? result.items : Array.isArray(result) ? result : []);
const resolvePagination = (result) => (result && typeof result === 'object' ? result.pagination || null : null);
const resolveAdmissionId = (snapshot) => toPublic(snapshot?.display_id || snapshot?.human_friendly_id || snapshot?.admission_id || snapshot?.id);
const resolvePatientId = (snapshot) => toPublic(snapshot?.patient_display_id || snapshot?.patient?.human_friendly_id || snapshot?.patient?.id);
const resolvePatientName = (snapshot) => sanitize(snapshot?.patient_display_name) || [sanitize(snapshot?.patient?.first_name), sanitize(snapshot?.patient?.last_name)].filter(Boolean).join(' ') || resolvePatientId(snapshot) || 'Unknown patient';
const defaultStartDraft = () => ({ patient_id: '', encounter_id: '', bed_id: '', admitted_at: toLocalDateTimeInput() });
const defaultTransferDraft = { from_ward_id: '', to_ward_id: '', transfer_request_id: '', action: 'APPROVE', to_bed_id: '' };

const deriveActionMatrix = (snapshot) => {
  const stage = sanitize(snapshot?.stage || snapshot?.flow?.stage).toUpperCase();
  const transferStatus = sanitize(snapshot?.open_transfer_request?.status || snapshot?.transfer_status).toUpperCase();
  const hasActiveBed = typeof snapshot?.has_active_bed === 'boolean' ? snapshot.has_active_bed : Boolean(snapshot?.active_bed_assignment);
  const isTerminal = TERMINAL_STAGES.has(stage);
  const hasOpenTransfer = OPEN_TRANSFER_STATUSES.has(transferStatus);
  return {
    canAssignBed: !isTerminal && !hasActiveBed,
    canReleaseBed: !isTerminal && hasActiveBed,
    canRequestTransfer: !isTerminal && hasActiveBed && !hasOpenTransfer,
    canUpdateTransfer: !isTerminal && hasOpenTransfer,
    canPlanDischarge: !isTerminal && !hasOpenTransfer,
    canFinalizeDischarge: !isTerminal && stage === 'DISCHARGE_PLANNED',
  };
};

const useIpdWorkbenchScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const { canRead, canWrite, canManageAllTenants, tenantId, facilityId, isResolved } = useScopeAccess(SCOPE_KEYS.IPD);
  const { list, get, start, assignBed, releaseBed, requestTransfer, updateTransfer, addWardRound, addNursingNote, addMedicationAdministration, planDischarge, finalizeDischarge, resolveLegacyRoute, reset, isLoading: isCrudLoading, errorCode } = useIpdFlow();
  const { list: listWards } = useWard();
  const { list: listBeds } = useBed();
  const { list: listPatients } = usePatient();

  const [flowList, setFlowList] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [selectedFlowId, setSelectedFlowId] = useState('');
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [startPatientSearchText, setStartPatientSearchText] = useState('');
  const [debouncedPatientSearch, setDebouncedPatientSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [queueScope, setQueueScope] = useState('ACTIVE');
  const [wardFilter, setWardFilter] = useState('');
  const [transferStatusFilter, setTransferStatusFilter] = useState('');
  const [hasActiveBedFilter, setHasActiveBedFilter] = useState('');
  const [isListLoading, setIsListLoading] = useState(false);
  const [isSelectedSnapshotLoading, setIsSelectedSnapshotLoading] = useState(false);
  const [isStartFormOpen, setIsStartFormOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [startDraft, setStartDraft] = useState(defaultStartDraft);
  const [assignBedDraft, setAssignBedDraft] = useState({ bed_id: '' });
  const [transferDraft, setTransferDraft] = useState(defaultTransferDraft);
  const [wardRoundDraft, setWardRoundDraft] = useState({ notes: '', round_at: '' });
  const [nursingDraft, setNursingDraft] = useState({ nurse_user_id: '', note: '' });
  const [medicationDraft, setMedicationDraft] = useState({ dose: '', unit: '', route: 'ORAL', administered_at: toLocalDateTimeInput() });
  const [dischargeDraft, setDischargeDraft] = useState({ summary: '', discharged_at: toLocalDateTimeInput() });
  const [wardOptions, setWardOptions] = useState([]);
  const [bedOptions, setBedOptions] = useState([]);
  const [startPatientOptions, setStartPatientOptions] = useState([]);
  const [isPatientSearchLoading, setIsPatientSearchLoading] = useState(false);
  const lastRealtimeRefreshRef = useRef(0);

  const parsedRouteState = useMemo(() => {
    try {
      return parseIpdWorkbenchRouteState(params || {});
    } catch (_error) {
      return {};
    }
  }, [params]);

  const scopeParams = useMemo(() => {
    if (canManageAllTenants) return {};
    const next = {};
    if (toIdentifier(tenantId)) next.tenant_id = toIdentifier(tenantId);
    if (toIdentifier(facilityId)) next.facility_id = toIdentifier(facilityId);
    return next;
  }, [canManageAllTenants, facilityId, tenantId]);

  const hasScope = canManageAllTenants || Boolean(scopeParams.tenant_id) || Boolean(scopeParams.facility_id);
  const canViewWorkbench = isResolved && (canRead || canManageAllTenants) && hasScope;
  const canMutate = canWrite && !isOffline;
  const requestedFlowId = normalizeScalar(parsedRouteState?.id);
  const requestedAction = normalizeScalar(parsedRouteState?.action).toLowerCase();
  const requestedResource = normalizeScalar(parsedRouteState?.resource).toLowerCase();
  const requestedLegacyId = normalizeScalar(parsedRouteState?.legacyId);
  const requestedPatientId = normalizeScalar(params?.patientId);

  const buildListParams = useCallback(() => {
    const next = { page: 1, limit: 40, sort_by: 'admitted_at', order: 'desc', queue_scope: queueScope, ...scopeParams };
    if (sanitize(debouncedSearch)) next.search = sanitize(debouncedSearch);
    if (sanitize(stageFilter)) next.stage = sanitize(stageFilter);
    if (sanitize(wardFilter)) next.ward_id = sanitize(wardFilter);
    if (sanitize(transferStatusFilter)) next.transfer_status = sanitize(transferStatusFilter);
    if (sanitize(hasActiveBedFilter)) next.has_active_bed = sanitize(hasActiveBedFilter) === 'true';
    return next;
  }, [debouncedSearch, hasActiveBedFilter, queueScope, scopeParams, stageFilter, transferStatusFilter, wardFilter]);

  const syncSelectedUrl = useCallback((id) => {
    const publicId = toPublic(id);
    if (!publicId) {
      router.replace('/ipd');
      return;
    }
    if (typeof router?.setParams === 'function') {
      try {
        router.setParams({ id: publicId });
        return;
      } catch (_error) {}
    }
    router.replace(`/ipd?id=${encodeURIComponent(publicId)}`);
  }, [router]);

  const upsertFlow = useCallback((snapshot) => {
    const admissionId = resolveAdmissionId(snapshot);
    if (!admissionId) return;
    setFlowList((previous) => {
      const index = previous.findIndex((item) => resolveAdmissionId(item).toUpperCase() === admissionId.toUpperCase());
      if (index < 0) return [snapshot, ...previous];
      const next = [...previous];
      next[index] = snapshot;
      return next;
    });
  }, []);

  const applySnapshot = useCallback((snapshot) => {
    const admissionId = resolveAdmissionId(snapshot);
    if (!admissionId) return;
    setSelectedFlow(snapshot);
    setSelectedFlowId(admissionId);
    upsertFlow(snapshot);
    syncSelectedUrl(admissionId);
  }, [syncSelectedUrl, upsertFlow]);

  const loadQueue = useCallback(async (light = false) => {
    if (!canViewWorkbench || isOffline) return;
    if (!light) {
      setIsListLoading(true);
      reset();
    }
    try {
      const result = await list(buildListParams());
      const items = resolveItems(result);
      setFlowList(items);
      setPagination(resolvePagination(result));
      if (!selectedFlowId && items.length > 0) {
        const firstId = resolveAdmissionId(items[0]);
        if (firstId) {
          setSelectedFlowId(firstId);
          syncSelectedUrl(firstId);
        }
      }
    } finally {
      if (!light) setIsListLoading(false);
    }
  }, [buildListParams, canViewWorkbench, isOffline, list, reset, selectedFlowId, syncSelectedUrl]);

  const loadSelected = useCallback(async () => {
    if (!canViewWorkbench || isOffline) return;
    if (!sanitize(selectedFlowId)) {
      setSelectedFlow(null);
      return;
    }
    setIsSelectedSnapshotLoading(true);
    try {
      const snapshot = await get(selectedFlowId);
      if (snapshot) {
        const publicAdmissionId = resolveAdmissionId(snapshot);
        setSelectedFlow(snapshot);
        if (publicAdmissionId && publicAdmissionId.toUpperCase() !== sanitize(selectedFlowId).toUpperCase()) {
          setSelectedFlowId(publicAdmissionId);
          syncSelectedUrl(publicAdmissionId);
        }
        upsertFlow(snapshot);
      }
    } finally {
      setIsSelectedSnapshotLoading(false);
    }
  }, [canViewWorkbench, get, isOffline, selectedFlowId, syncSelectedUrl, upsertFlow]);

  const loadOptions = useCallback(async () => {
    if (!canViewWorkbench || isOffline) return;
    try {
      const [wardsResult, bedsResult] = await Promise.all([
        listWards({ ...scopeParams, limit: 120, sort_by: 'name', order: 'asc' }),
        listBeds({ ...scopeParams, limit: 180, sort_by: 'label', order: 'asc' }),
      ]);
      setWardOptions(resolveItems(wardsResult).map((row) => ({ value: toPublic(row?.human_friendly_id || row?.id), label: sanitize(row?.name) || toPublic(row?.human_friendly_id || row?.id) })).filter((row) => row.value));
      setBedOptions(resolveItems(bedsResult).filter((row) => sanitize(row?.status).toUpperCase() === 'AVAILABLE').map((row) => ({ value: toPublic(row?.human_friendly_id || row?.id), label: sanitize(row?.label) || toPublic(row?.human_friendly_id || row?.id) })).filter((row) => row.value));
    } catch (_error) {
      setWardOptions([]);
      setBedOptions([]);
    }
  }, [canViewWorkbench, isOffline, listBeds, listWards, scopeParams]);

  const loadStartPatients = useCallback(async () => {
    if (!canViewWorkbench || isOffline) return;
    setIsPatientSearchLoading(true);
    try {
      const result = await listPatients({ ...scopeParams, page: 1, limit: 30, ...(sanitize(debouncedPatientSearch) ? { search: sanitize(debouncedPatientSearch) } : {}) });
      setStartPatientOptions(resolveItems(result).map((row) => {
        const id = toPublic(row?.human_friendly_id || row?.id);
        const name = [sanitize(row?.first_name), sanitize(row?.last_name)].filter(Boolean).join(' ');
        return { value: id, label: name ? `${name} (${id || t('common.notAvailable')})` : id || t('common.notAvailable') };
      }).filter((row) => row.value));
    } catch (_error) {
      setStartPatientOptions([]);
    } finally {
      setIsPatientSearchLoading(false);
    }
  }, [canViewWorkbench, debouncedPatientSearch, isOffline, listPatients, scopeParams, t]);

  const runMutation = useCallback(async (work, { refreshQueue = false, refreshOptions = false } = {}) => {
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
    if (refreshQueue) await loadQueue(true);
    if (refreshOptions) await loadOptions();
    return result;
  }, [applySnapshot, canMutate, loadOptions, loadQueue, t]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(sanitize(searchText)), 280);
    return () => clearTimeout(timer);
  }, [searchText]);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedPatientSearch(sanitize(startPatientSearchText)), 280);
    return () => clearTimeout(timer);
  }, [startPatientSearchText]);
  useEffect(() => { if (requestedPatientId) setStartDraft((prev) => ({ ...prev, patient_id: requestedPatientId })); }, [requestedPatientId]);
  useEffect(() => { if (requestedAction === 'start_admission') setIsStartFormOpen(true); }, [requestedAction]);
  useEffect(() => { if (requestedFlowId) setSelectedFlowId(requestedFlowId); }, [requestedFlowId]);
  useEffect(() => {
    const userId = toPublic(user?.human_friendly_id || user?.id);
    if (!userId) return;
    setNursingDraft((prev) => (sanitize(prev.nurse_user_id) ? prev : { ...prev, nurse_user_id: userId }));
  }, [user?.human_friendly_id, user?.id]);
  useEffect(() => {
    const fromWard = toPublic(selectedFlow?.active_bed_assignment?.bed?.ward?.id || selectedFlow?.active_bed_assignment?.bed?.ward?.human_friendly_id);
    if (fromWard) {
      setTransferDraft((prev) => ({ ...prev, from_ward_id: prev.from_ward_id || fromWard }));
    }
    if (sanitize(selectedFlow?.latest_discharge_summary?.status).toUpperCase() === 'PLANNED') {
      setDischargeDraft((prev) => ({
        ...prev,
        summary: sanitize(prev.summary) || sanitize(selectedFlow?.latest_discharge_summary?.summary),
        discharged_at: sanitize(prev.discharged_at) || toLocalDateTimeInput(selectedFlow?.latest_discharge_summary?.discharged_at || new Date()),
      }));
    }
  }, [selectedFlow]);
  useEffect(() => { loadOptions(); }, [loadOptions]);
  useEffect(() => { loadStartPatients(); }, [loadStartPatients]);
  useEffect(() => { loadQueue(false); }, [loadQueue]);
  useEffect(() => { loadSelected(); }, [loadSelected]);
  useEffect(() => {
    if (!requestedLegacyId || !requestedResource || requestedFlowId || !canViewWorkbench || isOffline) return;
    resolveLegacyRoute(requestedResource, requestedLegacyId).then((resolved) => {
      const admissionId = toPublic(resolved?.admission_id);
      if (!admissionId) return;
      router.replace(`/ipd?id=${encodeURIComponent(admissionId)}&panel=${encodeURIComponent(sanitize(resolved?.panel || 'snapshot'))}&action=${encodeURIComponent(sanitize(resolved?.action || requestedAction || 'open'))}&resource=${encodeURIComponent(requestedResource)}&legacyId=${encodeURIComponent(requestedLegacyId)}`);
    }).catch(() => {});
  }, [canViewWorkbench, isOffline, requestedAction, requestedFlowId, requestedLegacyId, requestedResource, resolveLegacyRoute, router]);

  const onRealtime = useCallback((payload = {}) => {
    const now = Date.now();
    if (now - lastRealtimeRefreshRef.current < 700) return;
    lastRealtimeRefreshRef.current = now;
    const eventAdmissionId = toPublic(payload?.admission_public_id || payload?.admission_id).toUpperCase();
    const selectedId = toPublic(selectedFlowId || selectedFlow?.id || selectedFlow?.display_id || selectedFlow?.human_friendly_id).toUpperCase();
    if (eventAdmissionId && selectedId && eventAdmissionId === selectedId) {
      loadSelected();
      return;
    }
    loadQueue(true);
  }, [loadQueue, loadSelected, selectedFlow, selectedFlowId]);
  useRealtimeEvent('ipd.flow.updated', onRealtime, { enabled: canViewWorkbench && !isOffline });
  useRealtimeEvent('admission.patient_admitted', onRealtime, { enabled: canViewWorkbench && !isOffline });
  useRealtimeEvent('admission.patient_transferred', onRealtime, { enabled: canViewWorkbench && !isOffline });
  useRealtimeEvent('admission.patient_discharged', onRealtime, { enabled: canViewWorkbench && !isOffline });
  useRealtimeEvent('admission.bed_assignment_changed', onRealtime, { enabled: canViewWorkbench && !isOffline });

  const actionMatrix = useMemo(() => deriveActionMatrix(selectedFlow), [selectedFlow]);
  const selectedSummary = useMemo(() => ({ admissionId: resolveAdmissionId(selectedFlow), patientName: resolvePatientName(selectedFlow), patientId: resolvePatientId(selectedFlow), stage: sanitize(selectedFlow?.stage || selectedFlow?.flow?.stage), nextStep: sanitize(selectedFlow?.next_step || selectedFlow?.flow?.next_step), activeBed: sanitize(selectedFlow?.active_bed_assignment?.bed?.label), activeWard: sanitize(selectedFlow?.active_bed_assignment?.bed?.ward?.name || selectedFlow?.ward_display_name), transferStatus: sanitize(selectedFlow?.open_transfer_request?.status || selectedFlow?.transfer_status) }), [selectedFlow]);
  const timelineItems = useMemo(() => (Array.isArray(selectedFlow?.timeline) ? selectedFlow.timeline : []).slice(0, 20).map((entry, index) => ({ id: `${sanitize(entry?.type)}-${sanitize(entry?.at)}-${index + 1}`, label: sanitize(entry?.label || entry?.type) || t('common.notAvailable'), timestamp: Number.isNaN(new Date(entry?.at).getTime()) ? sanitize(entry?.at) : new Date(entry?.at).toLocaleString() })), [selectedFlow?.timeline, t]);

  return {
    isResolved, canViewWorkbench, canMutate, isOffline,
    isLoading: !isResolved || (isListLoading && flowList.length === 0),
    isListLoading, isPatientSearchLoading, isSelectedSnapshotLoading, isCrudLoading, hasError: Boolean(errorCode), errorCode,
    flowList, pagination, selectedFlow, selectedFlowId, selectedSummary, actionMatrix, timelineItems, formError, isStartFormOpen,
    startDraft, assignBedDraft, transferDraft, wardRoundDraft, nursingDraft, medicationDraft, dischargeDraft,
    startPatientSearchText, startPatientOptions, searchText, stageFilter, wardFilter, transferStatusFilter, hasActiveBedFilter, queueScope,
    stageOptions: STAGE_OPTIONS.map((value) => ({ value, label: value ? value.replace(/_/g, ' ') : t('ipd.workbench.filters.allStages') })),
    transferStatusOptions: TRANSFER_STATUS_OPTIONS.map((value) => ({ value, label: value ? value.replace(/_/g, ' ') : t('ipd.workbench.filters.allTransferStates') })),
    hasActiveBedOptions: [{ value: '', label: t('ipd.workbench.filters.allBedStates') }, { value: 'true', label: t('ipd.workbench.filters.hasBed') }, { value: 'false', label: t('ipd.workbench.filters.noBed') }],
    queueScopeOptions: QUEUE_SCOPE_OPTIONS.map((entry) => ({ ...entry, label: entry.value === 'ACTIVE' ? t('ipd.workbench.filters.activeQueue') : t('ipd.workbench.filters.allQueue') })),
    wardOptions: [{ value: '', label: t('ipd.workbench.filters.allWards') }, ...wardOptions], bedOptions, transferActionOptions: TRANSFER_ACTION_OPTIONS, medicationRouteOptions: MEDICATION_ROUTE_OPTIONS,
    setIsStartFormOpen,
    onStartDraftChange: (field, value) => setStartDraft((prev) => ({ ...prev, [field]: value })),
    onStartPatientSearchChange: setStartPatientSearchText,
    onStartPatientSelect: (value) => setStartDraft((prev) => ({ ...prev, patient_id: value })),
    onOpenCreatePatient: () => router.push('/patients/patients/create?returnTo=%2Fipd%3Faction%3Dstart_admission'),
    onAssignBedDraftChange: (value) => setAssignBedDraft((prev) => ({ ...prev, bed_id: value })),
    onTransferDraftChange: (field, value) => setTransferDraft((prev) => ({ ...prev, [field]: value })),
    onWardRoundDraftChange: (field, value) => setWardRoundDraft((prev) => ({ ...prev, [field]: value })),
    onNursingDraftChange: (field, value) => setNursingDraft((prev) => ({ ...prev, [field]: value })),
    onMedicationDraftChange: (field, value) => setMedicationDraft((prev) => ({ ...prev, [field]: value })),
    onDischargeDraftChange: (field, value) => setDischargeDraft((prev) => ({ ...prev, [field]: value })),
    onFlowSearchChange: setSearchText, onStageFilterChange: setStageFilter, onWardFilterChange: setWardFilter, onTransferStatusFilterChange: setTransferStatusFilter, onHasActiveBedFilterChange: setHasActiveBedFilter, onQueueScopeChange: setQueueScope,
    onClearFilters: () => { setSearchText(''); setStageFilter(''); setWardFilter(''); setTransferStatusFilter(''); setHasActiveBedFilter(''); setQueueScope('ACTIVE'); },
    onStartAdmission: async () => { const patientId = toPublic(startDraft.patient_id); if (!patientId) { setFormError(t('ipd.workbench.validation.patientRequired')); return; } const res = await runMutation(() => start({ patient_id: patientId, encounter_id: toPublic(startDraft.encounter_id) || undefined, bed_id: toPublic(startDraft.bed_id) || undefined, admitted_at: toIso(startDraft.admitted_at) || new Date().toISOString(), ...scopeParams }), { refreshQueue: true, refreshOptions: true }); if (res) { setIsStartFormOpen(false); setStartDraft(defaultStartDraft()); } },
    onAssignBed: async () => { if (!actionMatrix.canAssignBed) return; const admissionId = toPublic(selectedFlowId); const bedId = toPublic(assignBedDraft.bed_id); if (!admissionId || !bedId) { setFormError(t('ipd.workbench.validation.bedRequired')); return; } const res = await runMutation(() => assignBed(admissionId, { bed_id: bedId }), { refreshOptions: true }); if (res) setAssignBedDraft({ bed_id: '' }); },
    onReleaseBed: async () => { if (!actionMatrix.canReleaseBed) return; const admissionId = toPublic(selectedFlowId); if (!admissionId) return; await runMutation(() => releaseBed(admissionId, {}), { refreshOptions: true }); },
    onRequestTransfer: async () => { if (!actionMatrix.canRequestTransfer) return; const admissionId = toPublic(selectedFlowId); const toWard = toPublic(transferDraft.to_ward_id); if (!admissionId || !toWard) { setFormError(t('ipd.workbench.validation.toWardRequired')); return; } await runMutation(() => requestTransfer(admissionId, { from_ward_id: toPublic(transferDraft.from_ward_id) || undefined, to_ward_id: toWard })); },
    onUpdateTransfer: async () => { if (!actionMatrix.canUpdateTransfer) return; const admissionId = toPublic(selectedFlowId); if (!admissionId) return; const action = sanitize(transferDraft.action).toUpperCase(); if (action === 'COMPLETE' && !toPublic(transferDraft.to_bed_id)) { setFormError(t('ipd.workbench.validation.transferBedRequired')); return; } await runMutation(() => updateTransfer(admissionId, { action, transfer_request_id: toPublic(transferDraft.transfer_request_id) || undefined, to_bed_id: toPublic(transferDraft.to_bed_id) || undefined })); },
    onAddWardRound: async () => { const admissionId = toPublic(selectedFlowId); if (!admissionId) return; const res = await runMutation(() => addWardRound(admissionId, { notes: sanitize(wardRoundDraft.notes) || undefined, round_at: toIso(wardRoundDraft.round_at) })); if (res) setWardRoundDraft({ notes: '', round_at: '' }); },
    onAddNursingNote: async () => { const admissionId = toPublic(selectedFlowId); const note = sanitize(nursingDraft.note); if (!admissionId || !note) { setFormError(t('ipd.workbench.validation.nursingNoteRequired')); return; } const res = await runMutation(() => addNursingNote(admissionId, { note, nurse_user_id: toPublic(nursingDraft.nurse_user_id) || undefined })); if (res) setNursingDraft((prev) => ({ ...prev, note: '' })); },
    onAddMedicationAdministration: async () => { const admissionId = toPublic(selectedFlowId); const dose = sanitize(medicationDraft.dose); if (!admissionId || !dose) { setFormError(t('ipd.workbench.validation.medicationDoseRequired')); return; } const res = await runMutation(() => addMedicationAdministration(admissionId, { dose, unit: sanitize(medicationDraft.unit) || undefined, route: sanitize(medicationDraft.route) || 'ORAL', administered_at: toIso(medicationDraft.administered_at) })); if (res) setMedicationDraft((prev) => ({ ...prev, dose: '', unit: '', administered_at: toLocalDateTimeInput() })); },
    onPlanDischarge: async () => { if (!actionMatrix.canPlanDischarge) return; const admissionId = toPublic(selectedFlowId); const summary = sanitize(dischargeDraft.summary); if (!admissionId || !summary) { setFormError(t('ipd.workbench.validation.dischargeSummaryRequired')); return; } await runMutation(() => planDischarge(admissionId, { summary, discharged_at: toIso(dischargeDraft.discharged_at) })); },
    onFinalizeDischarge: async () => { if (!actionMatrix.canFinalizeDischarge) return; const admissionId = toPublic(selectedFlowId); if (!admissionId) return; await runMutation(() => finalizeDischarge(admissionId, { summary: sanitize(dischargeDraft.summary) || undefined, discharged_at: toIso(dischargeDraft.discharged_at) }), { refreshQueue: true, refreshOptions: true }); },
    onSelectFlow: (flow) => { const id = resolveAdmissionId(flow); if (!id) return; setSelectedFlowId(id); setSelectedFlow(flow); syncSelectedUrl(id); },
    onOpenPatientProfile: () => { const id = resolvePatientId(selectedFlow); if (id) router.push(`/patients/patients/${encodeURIComponent(id)}`); },
    onOpenLabOrderCreate: () => router.push('/lab/orders/create'),
    onOpenRadiologyOrderCreate: () =>
      router.push('/radiology?resource=radiology-orders&action=create'),
    onOpenPharmacyOrderCreate: () => router.push('/pharmacy?action=create'),
    onOpenBillingInvoiceCreate: () => router.push('/billing/invoices/create'),
    onRetry: () => { if (selectedFlowId) loadSelected(); loadQueue(false); loadOptions(); },
  };
};

export default useIpdWorkbenchScreen;
