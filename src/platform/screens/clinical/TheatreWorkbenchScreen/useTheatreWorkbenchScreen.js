import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SCOPE_KEYS } from '@config/accessPolicy';
import { parseTheatreWorkbenchRouteState } from '@features/theatre-flow';
import {
  useAuth,
  useEncounter,
  useEquipmentRegistry,
  useI18n,
  useNetwork,
  useRealtimeEvent,
  useRoom,
  useScopeAccess,
  useStaffProfile,
  useTheatreFlow,
} from '@hooks';

const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const QUEUE_SCOPE_OPTIONS = ['ACTIVE', 'ALL'];
const STAGE_OPTIONS = [
  '',
  'PRE_OP',
  'SIGN_IN',
  'TIME_OUT',
  'INTRA_OP',
  'SIGN_OUT',
  'POST_OP',
  'PACU_HANDOFF',
  'COMPLETED',
];
const STATUS_OPTIONS = ['', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const RECORD_STATUS_OPTIONS = ['', 'DRAFT', 'FINAL'];
const CHECKLIST_PHASE_OPTIONS = [
  'PRE_OP',
  'SIGN_IN',
  'TIME_OUT',
  'SIGN_OUT',
  'PACU_HANDOFF',
];
const RESOURCE_TYPE_OPTIONS = ['ROOM', 'STAFF', 'EQUIPMENT'];
const STAFF_ROLE_OPTIONS = ['ANESTHETIST', 'SURGEON'];
const RECORD_TYPE_OPTIONS = ['ALL', 'ANESTHESIA', 'POST_OP'];
const PANEL_OPTIONS = [
  'snapshot',
  'checklist',
  'anesthesia',
  'resources',
  'post-op',
  'timeline',
];

const sanitize = (value) => String(value || '').trim();
const normalizeScalar = (value) =>
  Array.isArray(value) ? sanitize(value[0]) : sanitize(value);
const isUuidLike = (value) => UUID_LIKE_REGEX.test(sanitize(value));
const toPublicId = (value) => {
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
  Array.isArray(result?.items)
    ? result.items
    : Array.isArray(result)
      ? result
      : [];
const resolvePagination = (result) =>
  result && typeof result === 'object' ? result.pagination || null : null;
const resolveFlowId = (row) =>
  toPublicId(row?.display_id || row?.human_friendly_id || row?.id);
const resolvePatientName = (row) =>
  sanitize(row?.patient_display_name) || 'Unknown patient';
const resolveEncounterId = (row) => toPublicId(row?.encounter_display_id);
const dedupeOptions = (rows = []) => {
  const map = new Map();
  rows.forEach((row) => {
    const value = toPublicId(row?.value);
    if (!value || map.has(value)) return;
    map.set(value, { value, label: sanitize(row?.label) || value });
  });
  return Array.from(map.values());
};

const defaultStartDraft = (currentUserId = '') => ({
  encounter_id: '',
  scheduled_at: toLocalDateTimeInput(),
  status: 'SCHEDULED',
  workflow_stage: 'PRE_OP',
  room_id: '',
  surgeon_user_id: '',
  anesthetist_user_id: currentUserId,
  stage_notes: '',
});

const defaultStageDraft = () => ({
  workflow_stage: '',
  status: '',
  stage_notes: '',
});

const defaultChecklistDraft = () => ({
  phase: 'PRE_OP',
  item_code: '',
  item_label: '',
  is_checked: true,
  notes: '',
});

const defaultAnesthesiaDraft = (currentUserId = '') => ({
  anesthesia_record_id: '',
  anesthetist_user_id: currentUserId,
  notes: '',
  record_status: 'DRAFT',
});

const defaultObservationDraft = () => ({
  observed_at: toLocalDateTimeInput(),
  observation_type: '',
  metric_key: '',
  metric_value: '',
  unit: '',
  notes: '',
});

const defaultPostOpDraft = () => ({
  post_op_note_id: '',
  note: '',
  record_status: 'DRAFT',
});

const defaultAssignResourceDraft = () => ({
  resource_type: 'ROOM',
  resource_id: '',
  staff_role: 'ANESTHETIST',
  notes: '',
});

const defaultReleaseResourceDraft = () => ({
  allocation_id: '',
  resource_type: '',
  resource_id: '',
  released_at: '',
  notes: '',
});

const defaultFinalizeDraft = () => ({
  record_type: 'ALL',
  anesthesia_record_id: '',
  post_op_note_id: '',
});

const defaultReopenDraft = () => ({
  record_type: 'ALL',
  anesthesia_record_id: '',
  post_op_note_id: '',
  reason: '',
});

const useTheatreWorkbenchScreen = () => {
  const { t } = useI18n();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const currentUserId = toPublicId(user?.human_friendly_id || user?.id);

  const {
    canRead,
    canWrite,
    canManageAllTenants,
    tenantId,
    facilityId,
    isResolved,
  } = useScopeAccess(SCOPE_KEYS.THEATRE);

  const {
    list,
    get,
    resolveLegacyRoute,
    start,
    updateStage,
    upsertAnesthesiaRecord,
    addAnesthesiaObservation,
    upsertPostOpNote,
    toggleChecklistItem,
    assignResource,
    releaseResource,
    finalizeRecord,
    reopenRecord,
    reset,
    errorCode,
  } = useTheatreFlow();

  const { list: listRooms } = useRoom();
  const { list: listStaffProfiles } = useStaffProfile();
  const { list: listEquipmentRegistries } = useEquipmentRegistry();
  const { list: listEncounters } = useEncounter();

  const [flowList, setFlowList] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [selectedFlowId, setSelectedFlowId] = useState('');
  const [selectedFlow, setSelectedFlow] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [queueScope, setQueueScope] = useState('ACTIVE');
  const [stageFilter, setStageFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [anesthesiaStatusFilter, setAnesthesiaStatusFilter] = useState('');
  const [postOpStatusFilter, setPostOpStatusFilter] = useState('');
  const [finalizedFilter, setFinalizedFilter] = useState('');
  const [scheduledFromFilter, setScheduledFromFilter] = useState('');
  const [scheduledToFilter, setScheduledToFilter] = useState('');

  const [isListLoading, setIsListLoading] = useState(false);
  const [isSelectedSnapshotLoading, setIsSelectedSnapshotLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [activePanel, setActivePanel] = useState('snapshot');
  const [isStartFormOpen, setIsStartFormOpen] = useState(false);

  const [startDraft, setStartDraft] = useState(defaultStartDraft(currentUserId));
  const [stageDraft, setStageDraft] = useState(defaultStageDraft);
  const [checklistDraft, setChecklistDraft] = useState(defaultChecklistDraft);
  const [anesthesiaDraft, setAnesthesiaDraft] = useState(
    defaultAnesthesiaDraft(currentUserId)
  );
  const [observationDraft, setObservationDraft] = useState(defaultObservationDraft);
  const [postOpDraft, setPostOpDraft] = useState(defaultPostOpDraft);
  const [assignResourceDraft, setAssignResourceDraft] = useState(
    defaultAssignResourceDraft
  );
  const [releaseResourceDraft, setReleaseResourceDraft] = useState(
    defaultReleaseResourceDraft
  );
  const [finalizeDraft, setFinalizeDraft] = useState(defaultFinalizeDraft);
  const [reopenDraft, setReopenDraft] = useState(defaultReopenDraft);

  const [roomOptions, setRoomOptions] = useState([]);
  const [staffOptions, setStaffOptions] = useState([]);
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [encounterOptions, setEncounterOptions] = useState([]);

  const [roomSearchText, setRoomSearchText] = useState('');
  const [staffSearchText, setStaffSearchText] = useState('');
  const [equipmentSearchText, setEquipmentSearchText] = useState('');
  const [encounterSearchText, setEncounterSearchText] = useState('');

  const lastRealtimeRefreshRef = useRef(0);

  const parsedRouteState = useMemo(() => {
    try {
      return parseTheatreWorkbenchRouteState(params || {});
    } catch (_error) {
      return {};
    }
  }, [params]);

  const scopeParams = useMemo(() => {
    if (canManageAllTenants) return {};
    const next = {};
    if (sanitize(tenantId)) next.tenant_id = sanitize(tenantId);
    if (sanitize(facilityId)) next.facility_id = sanitize(facilityId);
    return next;
  }, [canManageAllTenants, facilityId, tenantId]);

  const hasScope =
    canManageAllTenants ||
    Boolean(scopeParams.tenant_id) ||
    Boolean(scopeParams.facility_id);
  const canViewWorkbench = isResolved && (canRead || canManageAllTenants) && hasScope;
  const canMutate = canWrite && !isOffline;

  const requestedFlowId = normalizeScalar(parsedRouteState?.id);
  const requestedAction = normalizeScalar(parsedRouteState?.action).toLowerCase();
  const requestedResource = normalizeScalar(parsedRouteState?.resource).toLowerCase();
  const requestedLegacyId = normalizeScalar(parsedRouteState?.legacyId);
  const requestedPanel = normalizeScalar(parsedRouteState?.panel).toLowerCase();

  const syncSelectedUrl = useCallback(
    (id) => {
      const publicId = toPublicId(id);
      if (!publicId) {
        router.replace('/theatre');
        return;
      }
      if (typeof router?.setParams === 'function') {
        try {
          router.setParams({ id: publicId });
          return;
        } catch (_error) {}
      }
      router.replace(`/theatre?id=${encodeURIComponent(publicId)}`);
    },
    [router]
  );

  const upsertFlow = useCallback((snapshot) => {
    const flowId = resolveFlowId(snapshot);
    if (!flowId) return;
    setFlowList((previous) => {
      const index = previous.findIndex(
        (row) => resolveFlowId(row).toUpperCase() === flowId.toUpperCase()
      );
      if (index < 0) return [snapshot, ...previous];
      const next = [...previous];
      next[index] = snapshot;
      return next;
    });
  }, []);

  const applySnapshot = useCallback(
    (snapshot) => {
      const flowId = resolveFlowId(snapshot);
      if (!flowId) return;
      setSelectedFlow(snapshot);
      setSelectedFlowId(flowId);
      upsertFlow(snapshot);
      syncSelectedUrl(flowId);
    },
    [syncSelectedUrl, upsertFlow]
  );

  const buildListParams = useCallback(() => {
    const next = {
      page: 1,
      limit: 40,
      sort_by: 'scheduled_at',
      order: 'desc',
      queue_scope: queueScope,
      ...scopeParams,
    };
    if (sanitize(debouncedSearch)) next.search = sanitize(debouncedSearch);
    if (sanitize(stageFilter)) next.stage = sanitize(stageFilter);
    if (sanitize(statusFilter)) next.status = sanitize(statusFilter);
    if (sanitize(roomFilter)) next.room_id = sanitize(roomFilter);
    if (sanitize(anesthesiaStatusFilter)) {
      next.anesthesia_status = sanitize(anesthesiaStatusFilter);
    }
    if (sanitize(postOpStatusFilter)) next.post_op_status = sanitize(postOpStatusFilter);
    if (sanitize(finalizedFilter)) next.finalized = sanitize(finalizedFilter) === 'true';
    if (toIso(scheduledFromFilter)) next.scheduled_from = toIso(scheduledFromFilter);
    if (toIso(scheduledToFilter)) next.scheduled_to = toIso(scheduledToFilter);
    return next;
  }, [
    anesthesiaStatusFilter,
    debouncedSearch,
    finalizedFilter,
    postOpStatusFilter,
    queueScope,
    roomFilter,
    scheduledFromFilter,
    scheduledToFilter,
    scopeParams,
    stageFilter,
    statusFilter,
  ]);

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
          const firstId = resolveFlowId(items[0]);
          if (firstId) {
            setSelectedFlowId(firstId);
            syncSelectedUrl(firstId);
          }
        }
      } finally {
        if (!light) setIsListLoading(false);
      }
    },
    [
      buildListParams,
      canViewWorkbench,
      isOffline,
      list,
      reset,
      selectedFlowId,
      syncSelectedUrl,
    ]
  );

  const loadSelected = useCallback(async () => {
    if (!canViewWorkbench || isOffline) return;
    if (!sanitize(selectedFlowId)) {
      setSelectedFlow(null);
      return;
    }
    setIsSelectedSnapshotLoading(true);
    try {
      const snapshot = await get(selectedFlowId, { include_timeline: true });
      if (!snapshot) return;
      const publicId = resolveFlowId(snapshot);
      setSelectedFlow(snapshot);
      if (publicId && publicId.toUpperCase() !== sanitize(selectedFlowId).toUpperCase()) {
        setSelectedFlowId(publicId);
        syncSelectedUrl(publicId);
      }
      upsertFlow(snapshot);
    } finally {
      setIsSelectedSnapshotLoading(false);
    }
  }, [canViewWorkbench, get, isOffline, selectedFlowId, syncSelectedUrl, upsertFlow]);

  const loadOptions = useCallback(async () => {
    if (!canViewWorkbench || isOffline) return;

    const roomPromise = listRooms({
      ...scopeParams,
      limit: 50,
      sort_by: 'name',
      order: 'asc',
      search: sanitize(roomSearchText) || undefined,
    });
    const staffPromise = listStaffProfiles({
      ...scopeParams,
      limit: 50,
      sort_by: 'updated_at',
      order: 'desc',
      search: sanitize(staffSearchText) || undefined,
    });
    const equipmentPromise = listEquipmentRegistries({
      ...scopeParams,
      limit: 50,
      sort_by: 'updated_at',
      order: 'desc',
      search: sanitize(equipmentSearchText) || undefined,
    });
    const encounterPromise = listEncounters({
      ...scopeParams,
      limit: 50,
      sort_by: 'started_at',
      order: 'desc',
      search: sanitize(encounterSearchText) || undefined,
    });

    try {
      const [roomsResult, staffResult, equipmentResult, encountersResult] =
        await Promise.all([
          roomPromise,
          staffPromise,
          equipmentPromise,
          encounterPromise,
        ]);

      setRoomOptions(
        dedupeOptions(
          resolveItems(roomsResult).map((row) => ({
            value: toPublicId(row?.display_id || row?.human_friendly_id || row?.id),
            label: sanitize(row?.name || row?.display_id || row?.human_friendly_id),
          }))
        )
      );

      setStaffOptions(
        dedupeOptions(
          resolveItems(staffResult).map((row) => {
            const firstName = sanitize(row?.user?.profile?.first_name);
            const lastName = sanitize(row?.user?.profile?.last_name);
            const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
            return {
              value: toPublicId(row?.display_id || row?.human_friendly_id || row?.id),
              label:
                fullName ||
                sanitize(row?.staff_number || row?.display_id || row?.human_friendly_id),
            };
          })
        )
      );

      setEquipmentOptions(
        dedupeOptions(
          resolveItems(equipmentResult).map((row) => ({
            value: toPublicId(row?.display_id || row?.human_friendly_id || row?.id),
            label:
              sanitize(row?.equipment_name || row?.name || row?.equipment_code) ||
              toPublicId(row?.display_id || row?.human_friendly_id || row?.id),
          }))
        )
      );

      setEncounterOptions(
        dedupeOptions(
          resolveItems(encountersResult).map((row) => {
            const firstName = sanitize(row?.patient?.first_name);
            const lastName = sanitize(row?.patient?.last_name);
            const patientName = [firstName, lastName].filter(Boolean).join(' ').trim();
            const encounterId = toPublicId(
              row?.display_id || row?.human_friendly_id || row?.id
            );
            return {
              value: encounterId,
              label: patientName ? `${patientName} | ${encounterId}` : encounterId,
            };
          })
        )
      );
    } catch (_error) {
      setRoomOptions([]);
      setStaffOptions([]);
      setEquipmentOptions([]);
      setEncounterOptions([]);
    }
  }, [
    canViewWorkbench,
    encounterSearchText,
    equipmentSearchText,
    isOffline,
    listEncounters,
    listEquipmentRegistries,
    listRooms,
    listStaffProfiles,
    roomSearchText,
    scopeParams,
    staffSearchText,
  ]);

  const runMutation = useCallback(
    async (work, { refreshQueue = false, refreshOptions = false } = {}) => {
      if (!canMutate) {
        setFormError('This workspace is read-only for your role.');
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
    [applySnapshot, canMutate, loadOptions, loadQueue]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(sanitize(searchText));
    }, 280);
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadOptions();
    }, 280);
    return () => clearTimeout(timer);
  }, [
    encounterSearchText,
    equipmentSearchText,
    loadOptions,
    roomSearchText,
    staffSearchText,
  ]);

  useEffect(() => {
    if (requestedFlowId && !isUuidLike(requestedFlowId)) {
      setSelectedFlowId(requestedFlowId);
    }
  }, [requestedFlowId]);

  useEffect(() => {
    if (!requestedPanel) return;
    if (!PANEL_OPTIONS.includes(requestedPanel)) return;
    setActivePanel(requestedPanel);
  }, [requestedPanel]);

  useEffect(() => {
    if (!requestedAction) return;
    if (
      requestedAction.includes('start') ||
      requestedAction.includes('create') ||
      requestedAction.includes('open_case')
    ) {
      setIsStartFormOpen(true);
    }
    if (requestedAction.includes('checklist')) setActivePanel('checklist');
    if (requestedAction.includes('anesthesia')) setActivePanel('anesthesia');
    if (requestedAction.includes('resource')) setActivePanel('resources');
    if (requestedAction.includes('post_op')) setActivePanel('post-op');
    if (requestedAction.includes('timeline')) setActivePanel('timeline');
  }, [requestedAction]);

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
        const flowId = toPublicId(resolved?.theatre_case_id);
        if (!flowId) return;
        router.replace(
          `/theatre?id=${encodeURIComponent(flowId)}&panel=${encodeURIComponent(
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

  useEffect(() => {
    loadQueue(false);
  }, [loadQueue]);

  useEffect(() => {
    loadSelected();
  }, [loadSelected]);

  useEffect(() => {
    if (!selectedFlow) return;
    const latestAnesthesia = selectedFlow?.latest_anesthesia_record || null;
    const latestPostOp = selectedFlow?.latest_post_op_note || null;
    const firstActiveAllocation = (selectedFlow?.resource_allocations || []).find(
      (entry) => !sanitize(entry?.released_at)
    );

    setStageDraft({
      workflow_stage: sanitize(selectedFlow?.stage || selectedFlow?.workflow_stage),
      status: sanitize(selectedFlow?.status),
      stage_notes: sanitize(selectedFlow?.stage_notes),
    });

    setAnesthesiaDraft((previous) => ({
      anesthesia_record_id:
        toPublicId(latestAnesthesia?.display_id || latestAnesthesia?.id) || '',
      anesthetist_user_id:
        toPublicId(latestAnesthesia?.anesthetist_user_display_id) ||
        toPublicId(selectedFlow?.anesthetist_user_display_id) ||
        previous.anesthetist_user_id ||
        currentUserId,
      notes: sanitize(latestAnesthesia?.notes),
      record_status: sanitize(latestAnesthesia?.record_status || 'DRAFT'),
    }));

    setPostOpDraft({
      post_op_note_id: toPublicId(latestPostOp?.display_id || latestPostOp?.id) || '',
      note:
        sanitize(latestPostOp?.note) ||
        `Post-op summary for ${resolvePatientName(selectedFlow)}.`,
      record_status: sanitize(latestPostOp?.record_status || 'DRAFT'),
    });

    setFinalizeDraft({
      record_type: 'ALL',
      anesthesia_record_id:
        toPublicId(latestAnesthesia?.display_id || latestAnesthesia?.id) || '',
      post_op_note_id: toPublicId(latestPostOp?.display_id || latestPostOp?.id) || '',
    });

    setReopenDraft((previous) => ({
      ...previous,
      anesthesia_record_id:
        toPublicId(latestAnesthesia?.display_id || latestAnesthesia?.id) || '',
      post_op_note_id: toPublicId(latestPostOp?.display_id || latestPostOp?.id) || '',
    }));

    setReleaseResourceDraft((previous) => ({
      ...previous,
      allocation_id:
        toPublicId(firstActiveAllocation?.display_id || firstActiveAllocation?.id) ||
        previous.allocation_id,
    }));

    setStartDraft((previous) => ({
      ...previous,
      room_id: toPublicId(selectedFlow?.room_display_id) || previous.room_id,
      surgeon_user_id:
        toPublicId(selectedFlow?.surgeon_user_display_id) || previous.surgeon_user_id,
      anesthetist_user_id:
        toPublicId(selectedFlow?.anesthetist_user_display_id) ||
        previous.anesthetist_user_id ||
        currentUserId,
    }));
  }, [currentUserId, selectedFlow]);

  useEffect(() => {
    if (!isResolved) return;
    if (!canRead || !hasScope) {
      router.replace('/dashboard');
    }
  }, [canRead, hasScope, isResolved, router]);

  const onRealtime = useCallback(
    (payload = {}) => {
      const now = Date.now();
      if (now - lastRealtimeRefreshRef.current < 700) return;
      lastRealtimeRefreshRef.current = now;

      const eventCaseId = toPublicId(payload?.theatre_case_public_id || payload?.theatre_case_id)
        .toUpperCase();
      const selectedId = toPublicId(selectedFlowId).toUpperCase();

      if (eventCaseId && selectedId && eventCaseId === selectedId) {
        loadSelected();
        return;
      }
      loadQueue(true);
    },
    [loadQueue, loadSelected, selectedFlowId]
  );

  useRealtimeEvent('theatre.flow.updated', onRealtime, {
    enabled: canViewWorkbench && !isOffline,
  });

  const selectedSummary = useMemo(() => {
    const checklistTotal = Number(selectedFlow?.checklist_summary?.total || 0);
    const checklistCompleted = Number(
      selectedFlow?.checklist_summary?.completed || 0
    );
    return {
      caseId: resolveFlowId(selectedFlow),
      patientName: resolvePatientName(selectedFlow),
      patientId: toPublicId(selectedFlow?.patient_display_id),
      encounterId: resolveEncounterId(selectedFlow),
      stage: sanitize(selectedFlow?.stage || selectedFlow?.workflow_stage),
      status: sanitize(selectedFlow?.status),
      room: sanitize(selectedFlow?.room_display_label || selectedFlow?.room_display_id),
      surgeon: sanitize(selectedFlow?.surgeon_display_name || selectedFlow?.surgeon_user_display_id),
      anesthetist: sanitize(
        selectedFlow?.anesthetist_display_name ||
          selectedFlow?.anesthetist_user_display_id
      ),
      anesthesiaStatus: sanitize(selectedFlow?.anesthesia_status),
      postOpStatus: sanitize(selectedFlow?.post_op_status),
      checklistProgress:
        checklistTotal > 0 ? `${checklistCompleted}/${checklistTotal}` : '0/0',
    };
  }, [selectedFlow]);

  const timelineItems = useMemo(
    () =>
      (Array.isArray(selectedFlow?.timeline) ? selectedFlow.timeline : [])
        .slice(0, 40)
        .map((entry, index) => ({
          id: `${sanitize(entry?.type)}-${sanitize(entry?.at)}-${index + 1}`,
          label: sanitize(entry?.label || entry?.type) || t('common.notAvailable'),
          timestamp: Number.isNaN(new Date(entry?.at).getTime())
            ? sanitize(entry?.at)
            : new Date(entry?.at).toLocaleString(),
        })),
    [selectedFlow?.timeline, t]
  );

  const activeResourceOptions = useMemo(() => {
    if (assignResourceDraft.resource_type === 'STAFF') return staffOptions;
    if (assignResourceDraft.resource_type === 'EQUIPMENT') return equipmentOptions;
    return roomOptions;
  }, [assignResourceDraft.resource_type, equipmentOptions, roomOptions, staffOptions]);

  return {
    isResolved,
    canViewWorkbench,
    canMutate,
    isOffline,
    isLoading: !isResolved || (isListLoading && flowList.length === 0),
    isListLoading,
    isSelectedSnapshotLoading,
    hasError: Boolean(errorCode),
    errorCode,
    flowList,
    pagination,
    selectedFlow,
    selectedFlowId,
    selectedSummary,
    timelineItems,
    formError,
    activePanel,
    panelOptions: PANEL_OPTIONS,
    isStartFormOpen,
    queueScopeOptions: QUEUE_SCOPE_OPTIONS.map((value) => ({
      value,
      label: value === 'ACTIVE' ? 'Active cases' : 'All cases',
    })),
    stageOptions: STAGE_OPTIONS.map((value) => ({
      value,
      label: value ? value.replace(/_/g, ' ') : 'All stages',
    })),
    statusOptions: STATUS_OPTIONS.map((value) => ({
      value,
      label: value ? value.replace(/_/g, ' ') : 'All statuses',
    })),
    recordStatusOptions: RECORD_STATUS_OPTIONS.map((value) => ({
      value,
      label: value || 'All',
    })),
    finalizedOptions: [
      { value: '', label: 'All records' },
      { value: 'true', label: 'Finalized only' },
      { value: 'false', label: 'Draft or mixed' },
    ],
    checklistPhaseOptions: CHECKLIST_PHASE_OPTIONS.map((value) => ({
      value,
      label: value.replace(/_/g, ' '),
    })),
    resourceTypeOptions: RESOURCE_TYPE_OPTIONS.map((value) => ({
      value,
      label: value,
    })),
    staffRoleOptions: STAFF_ROLE_OPTIONS.map((value) => ({
      value,
      label: value,
    })),
    recordTypeOptions: RECORD_TYPE_OPTIONS.map((value) => ({
      value,
      label: value,
    })),
    roomOptions,
    staffOptions,
    equipmentOptions,
    encounterOptions,
    activeResourceOptions,
    startDraft,
    stageDraft,
    checklistDraft,
    anesthesiaDraft,
    observationDraft,
    postOpDraft,
    assignResourceDraft,
    releaseResourceDraft,
    finalizeDraft,
    reopenDraft,
    searchText,
    queueScope,
    stageFilter,
    statusFilter,
    roomFilter,
    anesthesiaStatusFilter,
    postOpStatusFilter,
    finalizedFilter,
    scheduledFromFilter,
    scheduledToFilter,
    roomSearchText,
    staffSearchText,
    equipmentSearchText,
    encounterSearchText,
    setActivePanel,
    setIsStartFormOpen,
    onStartDraftChange: (field, value) =>
      setStartDraft((previous) => ({ ...previous, [field]: value })),
    onStageDraftChange: (field, value) =>
      setStageDraft((previous) => ({ ...previous, [field]: value })),
    onChecklistDraftChange: (field, value) =>
      setChecklistDraft((previous) => ({ ...previous, [field]: value })),
    onAnesthesiaDraftChange: (field, value) =>
      setAnesthesiaDraft((previous) => ({ ...previous, [field]: value })),
    onObservationDraftChange: (field, value) =>
      setObservationDraft((previous) => ({ ...previous, [field]: value })),
    onPostOpDraftChange: (field, value) =>
      setPostOpDraft((previous) => ({ ...previous, [field]: value })),
    onAssignResourceDraftChange: (field, value) =>
      setAssignResourceDraft((previous) => ({ ...previous, [field]: value })),
    onReleaseResourceDraftChange: (field, value) =>
      setReleaseResourceDraft((previous) => ({ ...previous, [field]: value })),
    onFinalizeDraftChange: (field, value) =>
      setFinalizeDraft((previous) => ({ ...previous, [field]: value })),
    onReopenDraftChange: (field, value) =>
      setReopenDraft((previous) => ({ ...previous, [field]: value })),
    onSearchChange: setSearchText,
    onQueueScopeChange: setQueueScope,
    onStageFilterChange: setStageFilter,
    onStatusFilterChange: setStatusFilter,
    onRoomFilterChange: setRoomFilter,
    onAnesthesiaStatusFilterChange: setAnesthesiaStatusFilter,
    onPostOpStatusFilterChange: setPostOpStatusFilter,
    onFinalizedFilterChange: setFinalizedFilter,
    onScheduledFromFilterChange: setScheduledFromFilter,
    onScheduledToFilterChange: setScheduledToFilter,
    onRoomSearchChange: setRoomSearchText,
    onStaffSearchChange: setStaffSearchText,
    onEquipmentSearchChange: setEquipmentSearchText,
    onEncounterSearchChange: setEncounterSearchText,
    onSelectFlow: (flow) => {
      const id = resolveFlowId(flow);
      if (!id) return;
      setSelectedFlowId(id);
      setSelectedFlow(flow);
      syncSelectedUrl(id);
    },
    onClearFilters: () => {
      setSearchText('');
      setQueueScope('ACTIVE');
      setStageFilter('');
      setStatusFilter('');
      setRoomFilter('');
      setAnesthesiaStatusFilter('');
      setPostOpStatusFilter('');
      setFinalizedFilter('');
      setScheduledFromFilter('');
      setScheduledToFilter('');
    },
    onStartCase: async () => {
      if (!sanitize(startDraft.encounter_id)) {
        setFormError('Encounter is required to start a theatre case.');
        return;
      }
      const result = await runMutation(
        () =>
          start({
            encounter_id: toPublicId(startDraft.encounter_id),
            scheduled_at: toIso(startDraft.scheduled_at),
            status: sanitize(startDraft.status) || undefined,
            workflow_stage: sanitize(startDraft.workflow_stage) || undefined,
            room_id: toPublicId(startDraft.room_id) || undefined,
            surgeon_user_id: toPublicId(startDraft.surgeon_user_id) || undefined,
            anesthetist_user_id:
              toPublicId(startDraft.anesthetist_user_id) || undefined,
            stage_notes: sanitize(startDraft.stage_notes) || undefined,
          }),
        { refreshQueue: true }
      );
      if (!result) return;
      setStartDraft(defaultStartDraft(currentUserId));
      setIsStartFormOpen(false);
    },
    onUpdateStage: async () => {
      const caseId = toPublicId(selectedFlowId);
      if (!caseId) return;
      await runMutation(
        () =>
          updateStage(caseId, {
            workflow_stage: sanitize(stageDraft.workflow_stage) || undefined,
            status: sanitize(stageDraft.status) || undefined,
            stage_notes: sanitize(stageDraft.stage_notes) || undefined,
          }),
        { refreshQueue: true }
      );
    },
    onToggleChecklistItem: async () => {
      const caseId = toPublicId(selectedFlowId);
      if (!caseId) return;
      if (!sanitize(checklistDraft.item_code)) {
        setFormError('Checklist item code is required.');
        return;
      }
      const result = await runMutation(() =>
        toggleChecklistItem(caseId, {
          checklist_item_id: toPublicId(checklistDraft.checklist_item_id) || undefined,
          phase: sanitize(checklistDraft.phase),
          item_code: sanitize(checklistDraft.item_code),
          item_label: sanitize(checklistDraft.item_label) || undefined,
          is_checked: Boolean(checklistDraft.is_checked),
          notes: sanitize(checklistDraft.notes) || undefined,
        })
      );
      if (result) {
        setChecklistDraft((previous) => ({
          ...previous,
          item_code: '',
          item_label: '',
          notes: '',
        }));
      }
    },
    onUpsertAnesthesiaRecord: async () => {
      const caseId = toPublicId(selectedFlowId);
      if (!caseId) return;
      await runMutation(() =>
        upsertAnesthesiaRecord(caseId, {
          anesthesia_record_id: toPublicId(anesthesiaDraft.anesthesia_record_id) || undefined,
          anesthetist_user_id: toPublicId(anesthesiaDraft.anesthetist_user_id) || undefined,
          notes: sanitize(anesthesiaDraft.notes) || undefined,
          record_status: sanitize(anesthesiaDraft.record_status) || undefined,
        })
      );
    },
    onAddAnesthesiaObservation: async () => {
      const caseId = toPublicId(selectedFlowId);
      if (!caseId) return;
      if (!sanitize(observationDraft.observation_type) && !sanitize(observationDraft.notes)) {
        setFormError('Observation type or notes is required.');
        return;
      }
      const result = await runMutation(() =>
        addAnesthesiaObservation(caseId, {
          observed_at: toIso(observationDraft.observed_at),
          observation_type: sanitize(observationDraft.observation_type) || undefined,
          metric_key: sanitize(observationDraft.metric_key) || undefined,
          metric_value: sanitize(observationDraft.metric_value) || undefined,
          unit: sanitize(observationDraft.unit) || undefined,
          notes: sanitize(observationDraft.notes) || undefined,
        })
      );
      if (result) {
        setObservationDraft(defaultObservationDraft());
      }
    },
    onUpsertPostOpNote: async () => {
      const caseId = toPublicId(selectedFlowId);
      if (!caseId) return;
      if (!sanitize(postOpDraft.note)) {
        setFormError('Post-op note is required.');
        return;
      }
      await runMutation(() =>
        upsertPostOpNote(caseId, {
          post_op_note_id: toPublicId(postOpDraft.post_op_note_id) || undefined,
          note: sanitize(postOpDraft.note),
          record_status: sanitize(postOpDraft.record_status) || undefined,
        })
      );
    },
    onAssignResource: async () => {
      const caseId = toPublicId(selectedFlowId);
      if (!caseId) return;
      if (!toPublicId(assignResourceDraft.resource_id)) {
        setFormError('Select a resource to assign.');
        return;
      }
      await runMutation(
        () =>
          assignResource(caseId, {
            resource_type: sanitize(assignResourceDraft.resource_type),
            resource_id: toPublicId(assignResourceDraft.resource_id),
            staff_role:
              sanitize(assignResourceDraft.resource_type).toUpperCase() === 'STAFF'
                ? sanitize(assignResourceDraft.staff_role || 'ANESTHETIST')
                : undefined,
            notes: sanitize(assignResourceDraft.notes) || undefined,
          }),
        { refreshQueue: true, refreshOptions: true }
      );
    },
    onReleaseResource: async () => {
      const caseId = toPublicId(selectedFlowId);
      if (!caseId) return;
      await runMutation(
        () =>
          releaseResource(caseId, {
            allocation_id: toPublicId(releaseResourceDraft.allocation_id) || undefined,
            resource_type: sanitize(releaseResourceDraft.resource_type) || undefined,
            resource_id: toPublicId(releaseResourceDraft.resource_id) || undefined,
            released_at: toIso(releaseResourceDraft.released_at),
            notes: sanitize(releaseResourceDraft.notes) || undefined,
          }),
        { refreshQueue: true, refreshOptions: true }
      );
    },
    onFinalizeRecord: async () => {
      const caseId = toPublicId(selectedFlowId);
      if (!caseId) return;
      await runMutation(
        () =>
          finalizeRecord(caseId, {
            record_type: sanitize(finalizeDraft.record_type || 'ALL'),
            anesthesia_record_id:
              toPublicId(finalizeDraft.anesthesia_record_id) || undefined,
            post_op_note_id: toPublicId(finalizeDraft.post_op_note_id) || undefined,
          }),
        { refreshQueue: true }
      );
    },
    onReopenRecord: async () => {
      const caseId = toPublicId(selectedFlowId);
      if (!caseId) return;
      if (!sanitize(reopenDraft.reason)) {
        setFormError('A reopen reason is required.');
        return;
      }
      await runMutation(
        () =>
          reopenRecord(caseId, {
            record_type: sanitize(reopenDraft.record_type || 'ALL'),
            anesthesia_record_id: toPublicId(reopenDraft.anesthesia_record_id) || undefined,
            post_op_note_id: toPublicId(reopenDraft.post_op_note_id) || undefined,
            reason: sanitize(reopenDraft.reason),
          }),
        { refreshQueue: true }
      );
    },
    onRetry: () => {
      loadQueue(false);
      loadSelected();
      loadOptions();
    },
    onOpenPatientProfile: () => {
      const patientId = toPublicId(selectedSummary.patientId);
      if (patientId) {
        router.push(`/patients/patients/${encodeURIComponent(patientId)}`);
      }
    },
    onOpenSchedulingAppointments: () => router.push('/scheduling/appointments'),
    onOpenSchedulingQueues: () => router.push('/scheduling/visit-queues'),
    onOpenRoomSettings: () => router.push('/settings/rooms'),
    onOpenStaffAssignments: () => router.push('/hr/staff-assignments'),
    onOpenEquipmentRegistries: () =>
      router.push('/housekeeping/biomedical/equipment-registries'),
  };
};

export default useTheatreWorkbenchScreen;
