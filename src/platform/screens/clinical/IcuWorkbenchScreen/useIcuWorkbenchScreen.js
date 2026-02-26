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
  useRealtimeEvent,
  useScopeAccess,
  useWard,
} from '@hooks';

const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
const ICU_STATUS_OPTIONS = ['', 'ACTIVE', 'ENDED', 'NONE'];
const TRANSFER_STATUS_OPTIONS = ['', 'REQUESTED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const CRITICAL_SEVERITY_OPTIONS = ['', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const QUEUE_SCOPE_OPTIONS = ['ACTIVE', 'ALL'];
const ICU_QUEUE_SCOPE_OPTIONS = ['WITH_ICU', 'ACTIVE', 'ALL'];
const TRANSFER_ACTION_OPTIONS = ['APPROVE', 'START', 'COMPLETE', 'CANCEL'];
const MEDICATION_ROUTE_OPTIONS = ['ORAL', 'IV', 'IM', 'TOPICAL', 'INHALATION', 'OTHER'];
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
const resolveItems = (result) =>
  Array.isArray(result?.items) ? result.items : Array.isArray(result) ? result : [];
const resolvePagination = (result) =>
  result && typeof result === 'object' ? result.pagination || null : null;
const resolveAdmissionId = (snapshot) =>
  toPublic(snapshot?.display_id || snapshot?.human_friendly_id || snapshot?.admission_id || snapshot?.id);
const resolvePatientId = (snapshot) =>
  toPublic(snapshot?.patient_display_id || snapshot?.patient?.human_friendly_id || snapshot?.patient?.id);
const resolvePatientName = (snapshot) =>
  sanitize(snapshot?.patient_display_name) ||
  [sanitize(snapshot?.patient?.first_name), sanitize(snapshot?.patient?.last_name)]
    .filter(Boolean)
    .join(' ') ||
  resolvePatientId(snapshot) ||
  'Unknown patient';
const resolveActiveIcuStayId = (snapshot) =>
  toPublic(snapshot?.active_icu_stay_id || snapshot?.icu?.active_stay?.id);
const resolveLatestIcuStayId = (snapshot) =>
  toPublic(snapshot?.latest_icu_stay_id || snapshot?.icu?.latest_stay?.id);
const defaultTransferDraft = {
  from_ward_id: '',
  to_ward_id: '',
  transfer_request_id: '',
  action: 'APPROVE',
  to_bed_id: '',
};
const defaultStartIcuDraft = () => ({ started_at: toLocalDateTimeInput() });
const defaultEndIcuDraft = () => ({ icu_stay_id: '', ended_at: toLocalDateTimeInput() });
const defaultObservationDraft = () => ({ icu_stay_id: '', observed_at: toLocalDateTimeInput(), observation: '' });
const defaultCriticalAlertDraft = () => ({ icu_stay_id: '', severity: 'HIGH', message: '' });

const deriveActionMatrix = (snapshot) => {
  const stage = sanitize(snapshot?.stage || snapshot?.flow?.stage).toUpperCase();
  const transferStatus = sanitize(snapshot?.open_transfer_request?.status || snapshot?.transfer_status).toUpperCase();
  const hasActiveBed =
    typeof snapshot?.has_active_bed === 'boolean'
      ? snapshot.has_active_bed
      : Boolean(snapshot?.active_bed_assignment);
  const isTerminal = TERMINAL_STAGES.has(stage);
  const hasOpenTransfer = OPEN_TRANSFER_STATUSES.has(transferStatus);
  const hasActiveIcuStay = Boolean(resolveActiveIcuStayId(snapshot));
  const hasCriticalAlert =
    typeof snapshot?.has_critical_alert === 'boolean'
      ? snapshot.has_critical_alert
      : Boolean(snapshot?.icu?.has_critical_alert);

  return {
    canStartIcuStay: !isTerminal && !hasActiveIcuStay,
    canEndIcuStay: !isTerminal && hasActiveIcuStay,
    canAddIcuObservation: !isTerminal && hasActiveIcuStay,
    canAddCriticalAlert: !isTerminal && hasActiveIcuStay,
    canResolveCriticalAlert: hasCriticalAlert,
    canAssignBed: !isTerminal && !hasActiveBed,
    canReleaseBed: !isTerminal && hasActiveBed,
    canRequestTransfer: !isTerminal && hasActiveBed && !hasOpenTransfer,
    canUpdateTransfer: !isTerminal && hasOpenTransfer,
    canPlanDischarge: !isTerminal && !hasOpenTransfer,
    canFinalizeDischarge: !isTerminal && stage === 'DISCHARGE_PLANNED',
  };
};

const dedupeByValue = (rows = []) => {
  const map = new Map();
  rows.forEach((row) => {
    const value = toPublic(row?.value);
    if (!value || map.has(value)) return;
    map.set(value, { value, label: sanitize(row?.label) || value });
  });
  return Array.from(map.values());
};

const useIcuWorkbenchScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const { canRead, canWrite, canManageAllTenants, tenantId, facilityId, isResolved } =
    useScopeAccess(SCOPE_KEYS.ICU);
  const {
    list,
    get,
    resolveLegacyRoute,
    startIcuStay,
    endIcuStay,
    addIcuObservation,
    addCriticalAlert,
    resolveCriticalAlert,
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
  const [icuStatusFilter, setIcuStatusFilter] = useState('ACTIVE');
  const [criticalSeverityFilter, setCriticalSeverityFilter] = useState('');
  const [hasCriticalAlertFilter, setHasCriticalAlertFilter] = useState('');
  const [queueScope, setQueueScope] = useState('ACTIVE');
  const [icuQueueScope, setIcuQueueScope] = useState('WITH_ICU');
  const [wardFilter, setWardFilter] = useState('');
  const [transferStatusFilter, setTransferStatusFilter] = useState('');
  const [hasActiveBedFilter, setHasActiveBedFilter] = useState('');
  const [isListLoading, setIsListLoading] = useState(false);
  const [isSelectedSnapshotLoading, setIsSelectedSnapshotLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [wardOptions, setWardOptions] = useState([]);
  const [bedOptions, setBedOptions] = useState([]);

  const [isStartIcuFormOpen, setIsStartIcuFormOpen] = useState(false);
  const [isObservationFormOpen, setIsObservationFormOpen] = useState(false);
  const [isAlertFormOpen, setIsAlertFormOpen] = useState(false);
  const [isSecondaryActionsOpen, setIsSecondaryActionsOpen] = useState(false);

  const [startIcuDraft, setStartIcuDraft] = useState(defaultStartIcuDraft);
  const [endIcuDraft, setEndIcuDraft] = useState(defaultEndIcuDraft);
  const [observationDraft, setObservationDraft] = useState(defaultObservationDraft);
  const [criticalAlertDraft, setCriticalAlertDraft] = useState(defaultCriticalAlertDraft);
  const [resolveAlertDraft, setResolveAlertDraft] = useState({ critical_alert_id: '' });

  const [assignBedDraft, setAssignBedDraft] = useState({ bed_id: '' });
  const [transferDraft, setTransferDraft] = useState(defaultTransferDraft);
  const [wardRoundDraft, setWardRoundDraft] = useState({ notes: '', round_at: '' });
  const [nursingDraft, setNursingDraft] = useState({ nurse_user_id: '', note: '' });
  const [medicationDraft, setMedicationDraft] = useState({
    dose: '',
    unit: '',
    route: 'ORAL',
    administered_at: toLocalDateTimeInput(),
  });
  const [dischargeDraft, setDischargeDraft] = useState({
    summary: '',
    discharged_at: toLocalDateTimeInput(),
  });
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

  const hasScope =
    canManageAllTenants || Boolean(scopeParams.tenant_id) || Boolean(scopeParams.facility_id);
  const canViewWorkbench = isResolved && (canRead || canManageAllTenants) && hasScope;
  const canMutate = canWrite && !isOffline;
  const requestedFlowId = normalizeScalar(parsedRouteState?.id);
  const requestedAction = normalizeScalar(parsedRouteState?.action).toLowerCase();
  const requestedResource = normalizeScalar(parsedRouteState?.resource).toLowerCase();
  const requestedLegacyId = normalizeScalar(parsedRouteState?.legacyId);
  const requestedPanel = normalizeScalar(parsedRouteState?.panel).toLowerCase();

  const buildListParams = useCallback(() => {
    const next = {
      page: 1,
      limit: 40,
      sort_by: 'admitted_at',
      order: 'desc',
      include_icu: true,
      queue_scope: queueScope,
      icu_queue_scope: icuQueueScope,
      ...scopeParams,
    };
    if (sanitize(debouncedSearch)) next.search = sanitize(debouncedSearch);
    if (sanitize(stageFilter)) next.stage = sanitize(stageFilter);
    if (sanitize(wardFilter)) next.ward_id = sanitize(wardFilter);
    if (sanitize(transferStatusFilter)) next.transfer_status = sanitize(transferStatusFilter);
    if (sanitize(icuStatusFilter)) next.icu_status = sanitize(icuStatusFilter);
    if (sanitize(criticalSeverityFilter)) next.critical_severity = sanitize(criticalSeverityFilter);
    if (sanitize(hasCriticalAlertFilter)) {
      next.has_critical_alert = sanitize(hasCriticalAlertFilter) === 'true';
    }
    if (sanitize(hasActiveBedFilter)) {
      next.has_active_bed = sanitize(hasActiveBedFilter) === 'true';
    }
    return next;
  }, [
    criticalSeverityFilter,
    debouncedSearch,
    hasActiveBedFilter,
    hasCriticalAlertFilter,
    icuQueueScope,
    icuStatusFilter,
    queueScope,
    scopeParams,
    stageFilter,
    transferStatusFilter,
    wardFilter,
  ]);

  const syncSelectedUrl = useCallback(
    (id) => {
      const publicId = toPublic(id);
      if (!publicId) {
        router.replace('/icu');
        return;
      }
      if (typeof router?.setParams === 'function') {
        try {
          router.setParams({ id: publicId });
          return;
        } catch (_error) {}
      }
      router.replace(`/icu?id=${encodeURIComponent(publicId)}`);
    },
    [router]
  );

  const upsertFlow = useCallback((snapshot) => {
    const admissionId = resolveAdmissionId(snapshot);
    if (!admissionId) return;
    setFlowList((previous) => {
      const index = previous.findIndex(
        (item) => resolveAdmissionId(item).toUpperCase() === admissionId.toUpperCase()
      );
      if (index < 0) return [snapshot, ...previous];
      const next = [...previous];
      next[index] = snapshot;
      return next;
    });
  }, []);

  const applySnapshot = useCallback(
    (snapshot) => {
      const admissionId = resolveAdmissionId(snapshot);
      if (!admissionId) return;
      setSelectedFlow(snapshot);
      setSelectedFlowId(admissionId);
      upsertFlow(snapshot);
      syncSelectedUrl(admissionId);
    },
    [syncSelectedUrl, upsertFlow]
  );

  const loadQueue = useCallback(
    async (light = false) => {
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
    },
    [buildListParams, canViewWorkbench, isOffline, list, reset, selectedFlowId, syncSelectedUrl]
  );

  const loadSelected = useCallback(async () => {
    if (!canViewWorkbench || isOffline) return;
    if (!sanitize(selectedFlowId)) {
      setSelectedFlow(null);
      return;
    }
    setIsSelectedSnapshotLoading(true);
    try {
      const snapshot = await get(selectedFlowId, { include_icu: true });
      if (snapshot) {
        const publicAdmissionId = resolveAdmissionId(snapshot);
        setSelectedFlow(snapshot);
        if (
          publicAdmissionId &&
          publicAdmissionId.toUpperCase() !== sanitize(selectedFlowId).toUpperCase()
        ) {
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
      setWardOptions(
        resolveItems(wardsResult)
          .map((row) => ({
            value: toPublic(row?.human_friendly_id || row?.id),
            label: sanitize(row?.name) || toPublic(row?.human_friendly_id || row?.id),
          }))
          .filter((row) => row.value)
      );
      setBedOptions(
        resolveItems(bedsResult)
          .filter((row) => sanitize(row?.status).toUpperCase() === 'AVAILABLE')
          .map((row) => ({
            value: toPublic(row?.human_friendly_id || row?.id),
            label: sanitize(row?.label) || toPublic(row?.human_friendly_id || row?.id),
          }))
          .filter((row) => row.value)
      );
    } catch (_error) {
      setWardOptions([]);
      setBedOptions([]);
    }
  }, [canViewWorkbench, isOffline, listBeds, listWards, scopeParams]);

  const runMutation = useCallback(
    async (work, { refreshQueue = false, refreshOptions = false } = {}) => {
      if (!canMutate) {
        setFormError(t('ipd.workbench.errors.readOnly'));
        return null;
      }
      setFormError('');
      const result = await work();
      if (!result) {
        setFormError('Unable to save changes. Please try again.');
        return null;
      }
      applySnapshot(result);
      if (refreshQueue) await loadQueue(true);
      if (refreshOptions) await loadOptions();
      return result;
    },
    [applySnapshot, canMutate, loadOptions, loadQueue, t]
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(sanitize(searchText)), 280);
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    if (requestedFlowId) setSelectedFlowId(requestedFlowId);
  }, [requestedFlowId]);

  useEffect(() => {
    if (!requestedAction) return;
    if (requestedAction.includes('start_icu_stay')) setIsStartIcuFormOpen(true);
    if (requestedAction.includes('add_icu_observation')) setIsObservationFormOpen(true);
    if (requestedAction.includes('add_critical_alert')) setIsAlertFormOpen(true);
    if (requestedAction.includes('resolve_critical_alert')) setIsAlertFormOpen(true);
    if (
      requestedAction.includes('assign_bed') ||
      requestedAction.includes('transfer') ||
      requestedAction.includes('ward_round') ||
      requestedAction.includes('nursing') ||
      requestedAction.includes('medication') ||
      requestedAction.includes('discharge')
    ) {
      setIsSecondaryActionsOpen(true);
    }
  }, [requestedAction]);

  useEffect(() => {
    if (!requestedPanel) return;
    if (requestedPanel === 'snapshot') return;
    if (requestedPanel === 'observations') setIsObservationFormOpen(true);
    if (requestedPanel === 'alerts') setIsAlertFormOpen(true);
    if (requestedPanel === 'secondary-actions') setIsSecondaryActionsOpen(true);
  }, [requestedPanel]);

  useEffect(() => {
    const userId = toPublic(user?.human_friendly_id || user?.id);
    if (!userId) return;
    setNursingDraft((prev) =>
      sanitize(prev.nurse_user_id) ? prev : { ...prev, nurse_user_id: userId }
    );
  }, [user?.human_friendly_id, user?.id]);

  useEffect(() => {
    const activeIcuStayId = resolveActiveIcuStayId(selectedFlow);
    const latestIcuStayId = resolveLatestIcuStayId(selectedFlow);
    const preferredStayId = activeIcuStayId || latestIcuStayId;
    if (preferredStayId) {
      setEndIcuDraft((prev) => ({ ...prev, icu_stay_id: prev.icu_stay_id || preferredStayId }));
      setObservationDraft((prev) => ({
        ...prev,
        icu_stay_id: prev.icu_stay_id || preferredStayId,
      }));
      setCriticalAlertDraft((prev) => ({
        ...prev,
        icu_stay_id: prev.icu_stay_id || preferredStayId,
      }));
    }
    const firstAlertId = toPublic(
      selectedFlow?.icu?.critical_alert_summary?.recent?.[0]?.id ||
        selectedFlow?.icu?.recent_alerts?.[0]?.id
    );
    if (firstAlertId) {
      setResolveAlertDraft((prev) => ({
        ...prev,
        critical_alert_id: prev.critical_alert_id || firstAlertId,
      }));
    }

    const fromWard = toPublic(
      selectedFlow?.active_bed_assignment?.bed?.ward?.id ||
        selectedFlow?.active_bed_assignment?.bed?.ward?.human_friendly_id
    );
    if (fromWard) {
      setTransferDraft((prev) => ({ ...prev, from_ward_id: prev.from_ward_id || fromWard }));
    }
    if (sanitize(selectedFlow?.latest_discharge_summary?.status).toUpperCase() === 'PLANNED') {
      setDischargeDraft((prev) => ({
        ...prev,
        summary: sanitize(prev.summary) || sanitize(selectedFlow?.latest_discharge_summary?.summary),
        discharged_at:
          sanitize(prev.discharged_at) ||
          toLocalDateTimeInput(selectedFlow?.latest_discharge_summary?.discharged_at || new Date()),
      }));
    }
  }, [selectedFlow]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);
  useEffect(() => {
    loadQueue(false);
  }, [loadQueue]);
  useEffect(() => {
    loadSelected();
  }, [loadSelected]);

  useEffect(() => {
    if (
      !requestedLegacyId ||
      !requestedResource ||
      requestedFlowId ||
      !canViewWorkbench ||
      isOffline
    ) {
      return;
    }
    resolveLegacyRoute(requestedResource, requestedLegacyId)
      .then((resolved) => {
        const admissionId = toPublic(resolved?.admission_id);
        if (!admissionId) return;
        router.replace(
          `/icu?id=${encodeURIComponent(admissionId)}&panel=${encodeURIComponent(
            sanitize(resolved?.panel || 'snapshot')
          )}&action=${encodeURIComponent(
            sanitize(resolved?.action || requestedAction || 'open')
          )}&resource=${encodeURIComponent(
            sanitize(requestedResource)
          )}&legacyId=${encodeURIComponent(requestedLegacyId)}`
        );
      })
      .catch(() => {});
  }, [
    canViewWorkbench,
    isOffline,
    requestedAction,
    requestedFlowId,
    requestedLegacyId,
    requestedResource,
    resolveLegacyRoute,
    router,
  ]);

  const onRealtime = useCallback(
    (payload = {}) => {
      const now = Date.now();
      if (now - lastRealtimeRefreshRef.current < 700) return;
      lastRealtimeRefreshRef.current = now;
      const eventAdmissionId = toPublic(payload?.admission_public_id || payload?.admission_id).toUpperCase();
      const selectedId = toPublic(
        selectedFlowId || selectedFlow?.id || selectedFlow?.display_id || selectedFlow?.human_friendly_id
      ).toUpperCase();
      if (eventAdmissionId && selectedId && eventAdmissionId === selectedId) {
        loadSelected();
        return;
      }
      loadQueue(true);
    },
    [loadQueue, loadSelected, selectedFlow, selectedFlowId]
  );

  useRealtimeEvent('ipd.flow.updated', onRealtime, { enabled: canViewWorkbench && !isOffline });
  useRealtimeEvent('admission.patient_admitted', onRealtime, { enabled: canViewWorkbench && !isOffline });
  useRealtimeEvent('admission.patient_transferred', onRealtime, { enabled: canViewWorkbench && !isOffline });
  useRealtimeEvent('admission.patient_discharged', onRealtime, { enabled: canViewWorkbench && !isOffline });
  useRealtimeEvent('admission.bed_assignment_changed', onRealtime, {
    enabled: canViewWorkbench && !isOffline,
  });

  const actionMatrix = useMemo(() => deriveActionMatrix(selectedFlow), [selectedFlow]);

  const selectedSummary = useMemo(
    () => ({
      admissionId: resolveAdmissionId(selectedFlow),
      patientName: resolvePatientName(selectedFlow),
      patientId: resolvePatientId(selectedFlow),
      stage: sanitize(selectedFlow?.stage || selectedFlow?.flow?.stage),
      nextStep: sanitize(selectedFlow?.next_step || selectedFlow?.flow?.next_step),
      activeBed: sanitize(selectedFlow?.active_bed_assignment?.bed?.label),
      activeWard: sanitize(
        selectedFlow?.active_bed_assignment?.bed?.ward?.name || selectedFlow?.ward_display_name
      ),
      transferStatus: sanitize(
        selectedFlow?.open_transfer_request?.status || selectedFlow?.transfer_status
      ),
      icuStatus: sanitize(selectedFlow?.icu_status || selectedFlow?.icu?.status),
      activeIcuStayId: resolveActiveIcuStayId(selectedFlow),
      latestIcuStayId: resolveLatestIcuStayId(selectedFlow),
      criticalSeverity: sanitize(
        selectedFlow?.critical_severity ||
          selectedFlow?.icu?.critical_severity ||
          selectedFlow?.icu?.critical_alert_summary?.highest_severity
      ),
      criticalAlertCount: Number(selectedFlow?.icu?.critical_alert_summary?.total || 0),
    }),
    [selectedFlow]
  );

  const stayOptions = useMemo(() => {
    const stays = dedupeByValue([
      {
        value: selectedFlow?.icu?.active_stay?.id,
        label: selectedFlow?.icu?.active_stay?.id
          ? `${selectedFlow?.icu?.active_stay?.id} (Active)`
          : '',
      },
      {
        value: selectedFlow?.icu?.latest_stay?.id,
        label: selectedFlow?.icu?.latest_stay?.id
          ? `${selectedFlow?.icu?.latest_stay?.id} (Latest)`
          : '',
      },
      ...(Array.isArray(selectedFlow?.icu?.recent_stays)
        ? selectedFlow.icu.recent_stays.map((row) => ({
            value: row?.id,
            label: row?.started_at
              ? `${row.id} | ${new Date(row.started_at).toLocaleString()}`
              : row?.id,
          }))
        : []),
    ]);
    return stays;
  }, [selectedFlow?.icu]);

  const alertOptions = useMemo(
    () =>
      dedupeByValue([
        ...(Array.isArray(selectedFlow?.icu?.critical_alert_summary?.recent)
          ? selectedFlow.icu.critical_alert_summary.recent.map((row) => ({
              value: row?.id,
              label: row?.id
                ? `${row.id} | ${sanitize(row?.severity) || 'ALERT'} | ${sanitize(row?.message)}`
                : '',
            }))
          : []),
        ...(Array.isArray(selectedFlow?.icu?.recent_alerts)
          ? selectedFlow.icu.recent_alerts.map((row) => ({
              value: row?.id,
              label: row?.id
                ? `${row.id} | ${sanitize(row?.severity) || 'ALERT'} | ${sanitize(row?.message)}`
                : '',
            }))
          : []),
      ]),
    [selectedFlow?.icu]
  );

  const timelineItems = useMemo(
    () =>
      (Array.isArray(selectedFlow?.timeline) ? selectedFlow.timeline : [])
        .slice(0, 24)
        .map((entry, index) => ({
          id: `${sanitize(entry?.type)}-${sanitize(entry?.at)}-${index + 1}`,
          label: sanitize(entry?.label || entry?.type) || t('common.notAvailable'),
          timestamp: Number.isNaN(new Date(entry?.at).getTime())
            ? sanitize(entry?.at)
            : new Date(entry?.at).toLocaleString(),
        })),
    [selectedFlow?.timeline, t]
  );

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
    actionMatrix,
    timelineItems,
    formError,
    isStartIcuFormOpen,
    isObservationFormOpen,
    isAlertFormOpen,
    isSecondaryActionsOpen,
    startIcuDraft,
    endIcuDraft,
    observationDraft,
    criticalAlertDraft,
    resolveAlertDraft,
    assignBedDraft,
    transferDraft,
    wardRoundDraft,
    nursingDraft,
    medicationDraft,
    dischargeDraft,
    searchText,
    stageFilter,
    icuStatusFilter,
    criticalSeverityFilter,
    hasCriticalAlertFilter,
    queueScope,
    icuQueueScope,
    wardFilter,
    transferStatusFilter,
    hasActiveBedFilter,
    stayOptions,
    alertOptions,
    stageOptions: STAGE_OPTIONS.map((value) => ({
      value,
      label: value ? value.replace(/_/g, ' ') : 'All stages',
    })),
    icuStatusOptions: ICU_STATUS_OPTIONS.map((value) => ({
      value,
      label: value ? value.replace(/_/g, ' ') : 'All ICU states',
    })),
    transferStatusOptions: TRANSFER_STATUS_OPTIONS.map((value) => ({
      value,
      label: value ? value.replace(/_/g, ' ') : 'All transfer states',
    })),
    criticalSeverityOptions: CRITICAL_SEVERITY_OPTIONS.map((value) => ({
      value,
      label: value || 'All severities',
    })),
    hasCriticalAlertOptions: [
      { value: '', label: 'All alert states' },
      { value: 'true', label: 'Has critical alert' },
      { value: 'false', label: 'No critical alert' },
    ],
    hasActiveBedOptions: [
      { value: '', label: 'All bed states' },
      { value: 'true', label: 'Has active bed' },
      { value: 'false', label: 'No active bed' },
    ],
    queueScopeOptions: QUEUE_SCOPE_OPTIONS.map((value) => ({
      value,
      label: value === 'ACTIVE' ? 'Active admissions' : 'All admissions',
    })),
    icuQueueScopeOptions: ICU_QUEUE_SCOPE_OPTIONS.map((value) => ({
      value,
      label:
        value === 'WITH_ICU'
          ? 'With ICU activity'
          : value === 'ACTIVE'
            ? 'Active ICU stays'
            : 'All ICU scopes',
    })),
    wardOptions: [{ value: '', label: 'All wards' }, ...wardOptions],
    bedOptions,
    transferActionOptions: TRANSFER_ACTION_OPTIONS,
    medicationRouteOptions: MEDICATION_ROUTE_OPTIONS,
    setIsStartIcuFormOpen,
    setIsObservationFormOpen,
    setIsAlertFormOpen,
    setIsSecondaryActionsOpen,
    onStartIcuDraftChange: (field, value) =>
      setStartIcuDraft((prev) => ({ ...prev, [field]: value })),
    onEndIcuDraftChange: (field, value) => setEndIcuDraft((prev) => ({ ...prev, [field]: value })),
    onObservationDraftChange: (field, value) =>
      setObservationDraft((prev) => ({ ...prev, [field]: value })),
    onCriticalAlertDraftChange: (field, value) =>
      setCriticalAlertDraft((prev) => ({ ...prev, [field]: value })),
    onResolveAlertDraftChange: (value) =>
      setResolveAlertDraft((prev) => ({ ...prev, critical_alert_id: value })),
    onAssignBedDraftChange: (value) => setAssignBedDraft((prev) => ({ ...prev, bed_id: value })),
    onTransferDraftChange: (field, value) => setTransferDraft((prev) => ({ ...prev, [field]: value })),
    onWardRoundDraftChange: (field, value) => setWardRoundDraft((prev) => ({ ...prev, [field]: value })),
    onNursingDraftChange: (field, value) => setNursingDraft((prev) => ({ ...prev, [field]: value })),
    onMedicationDraftChange: (field, value) =>
      setMedicationDraft((prev) => ({ ...prev, [field]: value })),
    onDischargeDraftChange: (field, value) =>
      setDischargeDraft((prev) => ({ ...prev, [field]: value })),
    onFlowSearchChange: setSearchText,
    onStageFilterChange: setStageFilter,
    onIcuStatusFilterChange: setIcuStatusFilter,
    onCriticalSeverityFilterChange: setCriticalSeverityFilter,
    onHasCriticalAlertFilterChange: setHasCriticalAlertFilter,
    onQueueScopeChange: setQueueScope,
    onIcuQueueScopeChange: setIcuQueueScope,
    onWardFilterChange: setWardFilter,
    onTransferStatusFilterChange: setTransferStatusFilter,
    onHasActiveBedFilterChange: setHasActiveBedFilter,
    onClearFilters: () => {
      setSearchText('');
      setStageFilter('');
      setIcuStatusFilter('ACTIVE');
      setCriticalSeverityFilter('');
      setHasCriticalAlertFilter('');
      setQueueScope('ACTIVE');
      setIcuQueueScope('WITH_ICU');
      setWardFilter('');
      setTransferStatusFilter('');
      setHasActiveBedFilter('');
    },
    onStartIcuStay: async () => {
      const admissionId = toPublic(selectedFlowId);
      if (!admissionId) return;
      await runMutation(
        () =>
          startIcuStay(admissionId, {
            started_at: toIso(startIcuDraft.started_at) || new Date().toISOString(),
          }),
        { refreshQueue: true }
      );
      setStartIcuDraft(defaultStartIcuDraft());
    },
    onEndIcuStay: async () => {
      if (!actionMatrix.canEndIcuStay) return;
      const admissionId = toPublic(selectedFlowId);
      if (!admissionId) return;
      await runMutation(
        () =>
          endIcuStay(admissionId, {
            icu_stay_id: toPublic(endIcuDraft.icu_stay_id) || undefined,
            ended_at: toIso(endIcuDraft.ended_at) || new Date().toISOString(),
          }),
        { refreshQueue: true }
      );
      setEndIcuDraft(defaultEndIcuDraft());
    },
    onAddIcuObservation: async () => {
      if (!actionMatrix.canAddIcuObservation) return;
      const admissionId = toPublic(selectedFlowId);
      const observation = sanitize(observationDraft.observation);
      if (!admissionId || !observation) {
        setFormError('Observation note is required.');
        return;
      }
      const result = await runMutation(() =>
        addIcuObservation(admissionId, {
          icu_stay_id: toPublic(observationDraft.icu_stay_id) || undefined,
          observed_at: toIso(observationDraft.observed_at) || new Date().toISOString(),
          observation,
        })
      );
      if (result) {
        setObservationDraft((prev) => ({
          ...defaultObservationDraft(),
          icu_stay_id: prev.icu_stay_id || resolveActiveIcuStayId(result),
        }));
      }
    },
    onAddCriticalAlert: async () => {
      if (!actionMatrix.canAddCriticalAlert) return;
      const admissionId = toPublic(selectedFlowId);
      const message = sanitize(criticalAlertDraft.message);
      if (!admissionId || !message) {
        setFormError('Alert message is required.');
        return;
      }
      const result = await runMutation(() =>
        addCriticalAlert(admissionId, {
          icu_stay_id: toPublic(criticalAlertDraft.icu_stay_id) || undefined,
          severity: sanitize(criticalAlertDraft.severity || 'HIGH').toUpperCase(),
          message,
        })
      );
      if (result) {
        setCriticalAlertDraft((prev) => ({
          ...defaultCriticalAlertDraft(),
          icu_stay_id: prev.icu_stay_id || resolveActiveIcuStayId(result),
        }));
      }
    },
    onResolveCriticalAlert: async () => {
      if (!actionMatrix.canResolveCriticalAlert) return;
      const admissionId = toPublic(selectedFlowId);
      const alertId = toPublic(resolveAlertDraft.critical_alert_id);
      if (!admissionId || !alertId) {
        setFormError('Select an alert to resolve.');
        return;
      }
      const result = await runMutation(() =>
        resolveCriticalAlert(admissionId, {
          critical_alert_id: alertId,
        })
      );
      if (result) {
        setResolveAlertDraft({ critical_alert_id: '' });
      }
    },
    onAssignBed: async () => {
      if (!actionMatrix.canAssignBed) return;
      const admissionId = toPublic(selectedFlowId);
      const bedId = toPublic(assignBedDraft.bed_id);
      if (!admissionId || !bedId) {
        setFormError(t('ipd.workbench.validation.bedRequired'));
        return;
      }
      const result = await runMutation(
        () =>
          assignBed(admissionId, {
            bed_id: bedId,
          }),
        { refreshOptions: true }
      );
      if (result) setAssignBedDraft({ bed_id: '' });
    },
    onReleaseBed: async () => {
      if (!actionMatrix.canReleaseBed) return;
      const admissionId = toPublic(selectedFlowId);
      if (!admissionId) return;
      await runMutation(() => releaseBed(admissionId, {}), { refreshOptions: true });
    },
    onRequestTransfer: async () => {
      if (!actionMatrix.canRequestTransfer) return;
      const admissionId = toPublic(selectedFlowId);
      const toWard = toPublic(transferDraft.to_ward_id);
      if (!admissionId || !toWard) {
        setFormError(t('ipd.workbench.validation.toWardRequired'));
        return;
      }
      await runMutation(() =>
        requestTransfer(admissionId, {
          from_ward_id: toPublic(transferDraft.from_ward_id) || undefined,
          to_ward_id: toWard,
        })
      );
    },
    onUpdateTransfer: async () => {
      if (!actionMatrix.canUpdateTransfer) return;
      const admissionId = toPublic(selectedFlowId);
      if (!admissionId) return;
      const action = sanitize(transferDraft.action).toUpperCase();
      if (action === 'COMPLETE' && !toPublic(transferDraft.to_bed_id)) {
        setFormError(t('ipd.workbench.validation.transferBedRequired'));
        return;
      }
      await runMutation(() =>
        updateTransfer(admissionId, {
          action,
          transfer_request_id: toPublic(transferDraft.transfer_request_id) || undefined,
          to_bed_id: toPublic(transferDraft.to_bed_id) || undefined,
        })
      );
    },
    onAddWardRound: async () => {
      const admissionId = toPublic(selectedFlowId);
      if (!admissionId) return;
      const result = await runMutation(() =>
        addWardRound(admissionId, {
          notes: sanitize(wardRoundDraft.notes) || undefined,
          round_at: toIso(wardRoundDraft.round_at),
        })
      );
      if (result) setWardRoundDraft({ notes: '', round_at: '' });
    },
    onAddNursingNote: async () => {
      const admissionId = toPublic(selectedFlowId);
      const note = sanitize(nursingDraft.note);
      if (!admissionId || !note) {
        setFormError(t('ipd.workbench.validation.nursingNoteRequired'));
        return;
      }
      const result = await runMutation(() =>
        addNursingNote(admissionId, {
          note,
          nurse_user_id: toPublic(nursingDraft.nurse_user_id) || undefined,
        })
      );
      if (result) {
        setNursingDraft((prev) => ({ ...prev, note: '' }));
      }
    },
    onAddMedicationAdministration: async () => {
      const admissionId = toPublic(selectedFlowId);
      const dose = sanitize(medicationDraft.dose);
      if (!admissionId || !dose) {
        setFormError(t('ipd.workbench.validation.medicationDoseRequired'));
        return;
      }
      const result = await runMutation(() =>
        addMedicationAdministration(admissionId, {
          dose,
          unit: sanitize(medicationDraft.unit) || undefined,
          route: sanitize(medicationDraft.route) || 'ORAL',
          administered_at: toIso(medicationDraft.administered_at),
        })
      );
      if (result) {
        setMedicationDraft((prev) => ({
          ...prev,
          dose: '',
          unit: '',
          administered_at: toLocalDateTimeInput(),
        }));
      }
    },
    onPlanDischarge: async () => {
      if (!actionMatrix.canPlanDischarge) return;
      const admissionId = toPublic(selectedFlowId);
      const summary = sanitize(dischargeDraft.summary);
      if (!admissionId || !summary) {
        setFormError(t('ipd.workbench.validation.dischargeSummaryRequired'));
        return;
      }
      await runMutation(() =>
        planDischarge(admissionId, {
          summary,
          discharged_at: toIso(dischargeDraft.discharged_at),
        })
      );
    },
    onFinalizeDischarge: async () => {
      if (!actionMatrix.canFinalizeDischarge) return;
      const admissionId = toPublic(selectedFlowId);
      if (!admissionId) return;
      await runMutation(
        () =>
          finalizeDischarge(admissionId, {
            summary: sanitize(dischargeDraft.summary) || undefined,
            discharged_at: toIso(dischargeDraft.discharged_at),
          }),
        { refreshQueue: true, refreshOptions: true }
      );
    },
    onSelectFlow: (flow) => {
      const id = resolveAdmissionId(flow);
      if (!id) return;
      setSelectedFlowId(id);
      setSelectedFlow(flow);
      syncSelectedUrl(id);
    },
    onOpenPatientProfile: () => {
      const id = resolvePatientId(selectedFlow);
      if (id) router.push(`/patients/patients/${encodeURIComponent(id)}`);
    },
    onOpenLabOrderCreate: () => router.push('/diagnostics/lab/lab-orders/create'),
    onOpenRadiologyOrderCreate: () => router.push('/diagnostics/radiology/radiology-orders/create'),
    onOpenPharmacyOrderCreate: () => router.push('/pharmacy/pharmacy-orders/create'),
    onOpenBillingInvoiceCreate: () => router.push('/billing/invoices/create'),
    onRetry: () => {
      if (selectedFlowId) loadSelected();
      loadQueue(false);
      loadOptions();
    },
  };
};

export default useIcuWorkbenchScreen;
