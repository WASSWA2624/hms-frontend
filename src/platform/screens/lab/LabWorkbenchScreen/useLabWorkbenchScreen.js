import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SCOPE_KEYS } from '@config/accessPolicy';
import { parseLabWorkbenchRouteState } from '@features/lab-workspace';
import {
  useAuth,
  useI18n,
  useLabWorkspace,
  useNetwork,
  useRealtimeEvent,
  useScopeAccess,
} from '@hooks';

const LAB_WORKBENCH_SESSION_STATE = {
  search: '',
  stage: 'ALL',
  status: '',
  criticality: 'ALL',
};

const ORDER_STATUS_OPTIONS = ['', 'ORDERED', 'COLLECTED', 'IN_PROCESS', 'COMPLETED', 'CANCELLED'];
const STAGE_OPTIONS = ['ALL', 'COLLECTION', 'PROCESSING', 'RESULTS', 'COMPLETED', 'CANCELLED'];
const CRITICALITY_OPTIONS = ['ALL', 'CRITICAL', 'NON_CRITICAL'];
const RESULT_STATUS_OPTIONS = ['NORMAL', 'ABNORMAL', 'CRITICAL'];
const RECEIVABLE_SAMPLE_STATES = new Set(['PENDING', 'COLLECTED']);
const REJECTABLE_SAMPLE_STATES = new Set(['PENDING', 'COLLECTED', 'RECEIVED']);
const RELEASEABLE_ORDER_ITEM_STATES = new Set(['ORDERED', 'COLLECTED', 'IN_PROCESS']);

const sanitize = (value) => String(value || '').trim();
const normalizeScalar = (value) =>
  Array.isArray(value) ? sanitize(value[0]) : sanitize(value);
const toIdentifier = (value) => sanitize(value);
const toIso = (value) => {
  const normalized = sanitize(value);
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

const defaultSummary = {
  total_orders: 0,
  collection_queue: 0,
  processing_queue: 0,
  results_queue: 0,
  critical_results: 0,
  completed_orders: 0,
  cancelled_orders: 0,
  rejected_samples: 0,
};

const defaultCollectDraft = () => ({
  sample_id: '',
  collected_at: toLocalDateTimeInput(),
  notes: '',
});

const defaultReceiveDraft = () => ({
  sample_id: '',
  received_at: toLocalDateTimeInput(),
  notes: '',
});

const defaultRejectDraft = () => ({
  sample_id: '',
  reason: '',
  notes: '',
});

const defaultReleaseDraft = () => ({
  order_item_id: '',
  result_id: '',
  status: 'NORMAL',
  result_value: '',
  result_unit: '',
  result_text: '',
  reported_at: toLocalDateTimeInput(),
  notes: '',
});

const buildWorklistCountLabel = (order) => {
  const pending = Number(order?.pending_item_count || 0);
  const inProcess = Number(order?.in_process_item_count || 0);
  const completed = Number(order?.completed_item_count || 0);
  return `Pending ${pending} | Processing ${inProcess} | Completed ${completed}`;
};

const useLabWorkbenchScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const { isOffline } = useNetwork();
  const {
    canRead,
    canWrite,
    canManageAllTenants,
    tenantId,
    isResolved,
  } = useScopeAccess(SCOPE_KEYS.LAB);
  const {
    listWorkbench,
    getWorkflow,
    resolveLegacyRoute,
    collect,
    receive,
    reject,
    release,
    reset,
    isLoading: isCrudLoading,
    errorCode,
  } = useLabWorkspace();

  const [summary, setSummary] = useState(defaultSummary);
  const [worklist, setWorklist] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [searchText, setSearchText] = useState(LAB_WORKBENCH_SESSION_STATE.search);
  const [debouncedSearch, setDebouncedSearch] = useState(LAB_WORKBENCH_SESSION_STATE.search);
  const [stageFilter, setStageFilter] = useState(LAB_WORKBENCH_SESSION_STATE.stage);
  const [statusFilter, setStatusFilter] = useState(LAB_WORKBENCH_SESSION_STATE.status);
  const [criticalityFilter, setCriticalityFilter] = useState(LAB_WORKBENCH_SESSION_STATE.criticality);
  const [isQueueLoading, setIsQueueLoading] = useState(false);
  const [isWorkflowLoading, setIsWorkflowLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [collectDraft, setCollectDraft] = useState(defaultCollectDraft);
  const [receiveDraft, setReceiveDraft] = useState(defaultReceiveDraft);
  const [rejectDraft, setRejectDraft] = useState(defaultRejectDraft);
  const [releaseDraft, setReleaseDraft] = useState(defaultReleaseDraft);
  const lastRealtimeRefreshRef = useRef(0);

  const parsedRouteState = useMemo(() => {
    try {
      return parseLabWorkbenchRouteState(params || {});
    } catch (_error) {
      return {};
    }
  }, [params]);

  const hasScope = canManageAllTenants || Boolean(toIdentifier(tenantId));
  const canViewWorkbench = isResolved && canRead && hasScope;
  const canMutate = canWrite && !isOffline;
  const requestedOrderId = normalizeScalar(parsedRouteState?.id);
  const requestedLegacyResource = normalizeScalar(parsedRouteState?.resource).toLowerCase();
  const requestedLegacyId = normalizeScalar(parsedRouteState?.legacyId);
  const requestedPatientId = normalizeScalar(parsedRouteState?.patientId);
  const requestedEncounterId = normalizeScalar(parsedRouteState?.encounterId);

  const syncSelectedUrl = useCallback(
    (id) => {
      const normalizedId = toIdentifier(id);
      if (!normalizedId) {
        router.replace('/lab');
        return;
      }

      if (typeof router?.setParams === 'function') {
        try {
          router.setParams({ id: normalizedId });
          return;
        } catch (_error) {}
      }

      router.replace(`/lab?id=${encodeURIComponent(normalizedId)}`);
    },
    [router]
  );

  const upsertWorkbenchOrder = useCallback((order) => {
    const id = toIdentifier(order?.id || order?.display_id);
    if (!id) return;

    setWorklist((previous) => {
      const index = previous.findIndex(
        (entry) => toIdentifier(entry?.id || entry?.display_id).toUpperCase() === id.toUpperCase()
      );
      if (index < 0) return [order, ...previous];
      const next = [...previous];
      next[index] = {
        ...next[index],
        ...order,
      };
      return next;
    });
  }, []);

  const applyWorkflow = useCallback(
    (workflow) => {
      const order = workflow?.order || null;
      const id = toIdentifier(order?.id || order?.display_id);
      setSelectedWorkflow(workflow || null);
      if (id) {
        setSelectedOrderId(id);
        syncSelectedUrl(id);
        upsertWorkbenchOrder(order);
      }
    },
    [syncSelectedUrl, upsertWorkbenchOrder]
  );

  const buildListParams = useCallback(() => {
    const next = {
      page: 1,
      limit: 50,
      sort_by: 'ordered_at',
      order: 'desc',
    };

    if (sanitize(debouncedSearch)) next.search = sanitize(debouncedSearch);
    if (sanitize(stageFilter) && sanitize(stageFilter).toUpperCase() !== 'ALL') {
      next.stage = sanitize(stageFilter).toUpperCase();
    }
    if (sanitize(statusFilter)) {
      next.status = sanitize(statusFilter).toUpperCase();
    }
    if (
      sanitize(criticalityFilter) &&
      sanitize(criticalityFilter).toUpperCase() !== 'ALL'
    ) {
      next.criticality = sanitize(criticalityFilter).toUpperCase();
    }

    return next;
  }, [criticalityFilter, debouncedSearch, stageFilter, statusFilter]);

  const loadWorkbench = useCallback(
    async (light = false) => {
      if (!canViewWorkbench || isOffline) return;
      if (!light) {
        setIsQueueLoading(true);
        reset();
      }

      try {
        const payload = await listWorkbench(buildListParams());
        const nextWorklist = Array.isArray(payload?.worklist)
          ? payload.worklist
          : [];

        setSummary(payload?.summary || defaultSummary);
        setWorklist(nextWorklist);
        setPagination(payload?.pagination || null);

        if (!selectedOrderId && nextWorklist.length > 0) {
          const firstId = toIdentifier(nextWorklist[0]?.id || nextWorklist[0]?.display_id);
          if (firstId) {
            setSelectedOrderId(firstId);
            syncSelectedUrl(firstId);
          }
        }
      } finally {
        if (!light) setIsQueueLoading(false);
      }
    },
    [buildListParams, canViewWorkbench, isOffline, listWorkbench, reset, selectedOrderId, syncSelectedUrl]
  );

  const loadSelectedWorkflow = useCallback(async () => {
    if (!canViewWorkbench || isOffline) return;
    const id = toIdentifier(selectedOrderId);
    if (!id) {
      setSelectedWorkflow(null);
      return;
    }

    setIsWorkflowLoading(true);
    try {
      const workflow = await getWorkflow(id);
      if (workflow) {
        const resolvedId = toIdentifier(workflow?.order?.id || workflow?.order?.display_id);
        if (resolvedId && resolvedId.toUpperCase() !== id.toUpperCase()) {
          setSelectedOrderId(resolvedId);
          syncSelectedUrl(resolvedId);
        }
        applyWorkflow(workflow);
      }
    } finally {
      setIsWorkflowLoading(false);
    }
  }, [applyWorkflow, canViewWorkbench, getWorkflow, isOffline, selectedOrderId, syncSelectedUrl]);

  const runMutation = useCallback(
    async (work, { refreshQueue = false } = {}) => {
      if (!canMutate) {
        setFormError(t('lab.workbench.errors.readOnly'));
        return null;
      }

      setFormError('');
      const result = await work();
      if (!result) {
        setFormError(t('lab.workbench.errors.actionFailed'));
        return null;
      }

      if (result.workflow) {
        applyWorkflow(result.workflow);
      }

      if (refreshQueue) {
        await loadWorkbench(true);
      }

      return result;
    },
    [applyWorkflow, canMutate, loadWorkbench, t]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(sanitize(searchText));
    }, 280);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    LAB_WORKBENCH_SESSION_STATE.search = searchText;
    LAB_WORKBENCH_SESSION_STATE.stage = stageFilter;
    LAB_WORKBENCH_SESSION_STATE.status = statusFilter;
    LAB_WORKBENCH_SESSION_STATE.criticality = criticalityFilter;
  }, [criticalityFilter, searchText, stageFilter, statusFilter]);

  useEffect(() => {
    if (requestedOrderId) {
      setSelectedOrderId(requestedOrderId);
    }
  }, [requestedOrderId]);

  useEffect(() => {
    loadWorkbench(false);
  }, [loadWorkbench]);

  useEffect(() => {
    loadSelectedWorkflow();
  }, [loadSelectedWorkflow]);

  useEffect(() => {
    if (!requestedLegacyId || !requestedLegacyResource || requestedOrderId) return;
    if (!canViewWorkbench || isOffline) return;

    resolveLegacyRoute(requestedLegacyResource, requestedLegacyId)
      .then((resolved) => {
        const targetId = toIdentifier(resolved?.identifier || resolved?.id);
        if (!targetId) return;
        router.replace(
          `/lab?id=${encodeURIComponent(targetId)}&resource=${encodeURIComponent(
            requestedLegacyResource
          )}&legacyId=${encodeURIComponent(requestedLegacyId)}`
        );
      })
      .catch(() => {});
  }, [
    canViewWorkbench,
    isOffline,
    requestedLegacyId,
    requestedLegacyResource,
    requestedOrderId,
    resolveLegacyRoute,
    router,
  ]);

  useEffect(() => {
    const samples = Array.isArray(selectedWorkflow?.order?.samples)
      ? selectedWorkflow.order.samples
      : [];
    const items = Array.isArray(selectedWorkflow?.order?.items)
      ? selectedWorkflow.order.items
      : [];

    const collectableSample = samples.find((sample) => {
      const status = sanitize(sample?.status).toUpperCase();
      return status === 'PENDING' || status === 'COLLECTED';
    });
    const receivableSample = samples.find((sample) =>
      RECEIVABLE_SAMPLE_STATES.has(sanitize(sample?.status).toUpperCase())
    );
    const rejectableSample = samples.find((sample) =>
      REJECTABLE_SAMPLE_STATES.has(sanitize(sample?.status).toUpperCase())
    );
    const releasableItem = items.find((item) =>
      RELEASEABLE_ORDER_ITEM_STATES.has(sanitize(item?.status).toUpperCase())
    );

    setCollectDraft((previous) => ({
      ...previous,
      sample_id: previous.sample_id || toIdentifier(collectableSample?.id),
    }));
    setReceiveDraft((previous) => ({
      ...previous,
      sample_id: previous.sample_id || toIdentifier(receivableSample?.id),
    }));
    setRejectDraft((previous) => ({
      ...previous,
      sample_id: previous.sample_id || toIdentifier(rejectableSample?.id),
    }));
    setReleaseDraft((previous) => ({
      ...previous,
      order_item_id: previous.order_item_id || toIdentifier(releasableItem?.id),
    }));
  }, [selectedWorkflow]);

  const onRealtime = useCallback(
    (payload = {}) => {
      const now = Date.now();
      if (now - lastRealtimeRefreshRef.current < 700) return;
      lastRealtimeRefreshRef.current = now;

      const incomingOrderId = toIdentifier(
        payload?.order_public_id || payload?.order_id
      ).toUpperCase();
      const currentOrderId = toIdentifier(selectedOrderId).toUpperCase();

      if (incomingOrderId && currentOrderId && incomingOrderId === currentOrderId) {
        loadSelectedWorkflow();
        return;
      }

      loadWorkbench(true);
    },
    [loadSelectedWorkflow, loadWorkbench, selectedOrderId]
  );

  useRealtimeEvent('diagnostic.lab_workflow_updated', onRealtime, {
    enabled: canViewWorkbench && !isOffline,
  });
  useRealtimeEvent('diagnostic.lab_result_updated', onRealtime, {
    enabled: canViewWorkbench && !isOffline,
  });
  useRealtimeEvent('diagnostic.lab_result_ready', onRealtime, {
    enabled: canViewWorkbench && !isOffline,
  });

  const sampleOptions = useMemo(() => {
    const samples = Array.isArray(selectedWorkflow?.order?.samples)
      ? selectedWorkflow.order.samples
      : [];

    return samples
      .map((sample) => {
        const id = toIdentifier(sample?.id || sample?.display_id);
        if (!id) return null;
        const status = sanitize(sample?.status).toUpperCase() || t('common.notAvailable');
        return {
          value: id,
          label: `${id} (${status})`,
          status,
        };
      })
      .filter(Boolean);
  }, [selectedWorkflow?.order?.samples, t]);

  const orderItemOptions = useMemo(() => {
    const items = Array.isArray(selectedWorkflow?.order?.items)
      ? selectedWorkflow.order.items
      : [];

    return items
      .map((item) => {
        const id = toIdentifier(item?.id || item?.display_id);
        if (!id) return null;
        const status = sanitize(item?.status).toUpperCase() || t('common.notAvailable');
        const testName = sanitize(item?.test_display_name || item?.test_code || id);
        return {
          value: id,
          label: `${testName} (${status})`,
          status,
        };
      })
      .filter(Boolean);
  }, [selectedWorkflow?.order?.items, t]);

  const selectedResultsForOrderItem = useMemo(() => {
    const selectedItemId = toIdentifier(releaseDraft.order_item_id);
    const results = Array.isArray(selectedWorkflow?.results)
      ? selectedWorkflow.results
      : [];

    return results.filter(
      (result) =>
        toIdentifier(result?.lab_order_item_id).toUpperCase() ===
        selectedItemId.toUpperCase()
    );
  }, [releaseDraft.order_item_id, selectedWorkflow?.results]);

  const resultOptions = useMemo(() =>
    selectedResultsForOrderItem
      .map((result) => {
        const id = toIdentifier(result?.id || result?.display_id);
        if (!id) return null;
        const status = sanitize(result?.status).toUpperCase() || t('common.notAvailable');
        return {
          value: id,
          label: `${id} (${status})`,
        };
      })
      .filter(Boolean)
  , [selectedResultsForOrderItem, t]);

  useEffect(() => {
    if (!selectedResultsForOrderItem.length) return;

    const pending = selectedResultsForOrderItem.find(
      (result) => sanitize(result?.status).toUpperCase() === 'PENDING'
    );

    setReleaseDraft((previous) => ({
      ...previous,
      result_id: previous.result_id || toIdentifier(pending?.id || selectedResultsForOrderItem[0]?.id),
      result_unit: previous.result_unit || sanitize(pending?.result_unit || selectedResultsForOrderItem[0]?.result_unit),
    }));
  }, [selectedResultsForOrderItem]);

  const actionMatrix = useMemo(() => {
    const nextActions = selectedWorkflow?.next_actions || {};
    const collectableSamples = sampleOptions.filter((option) =>
      ['PENDING', 'COLLECTED'].includes(option.status)
    );
    const receivableSamples = sampleOptions.filter((option) =>
      RECEIVABLE_SAMPLE_STATES.has(option.status)
    );
    const rejectableSamples = sampleOptions.filter((option) =>
      REJECTABLE_SAMPLE_STATES.has(option.status)
    );
    const releasableItems = orderItemOptions.filter((option) =>
      RELEASEABLE_ORDER_ITEM_STATES.has(option.status)
    );

    return {
      canCollect:
        Boolean(nextActions.can_collect) &&
        (collectableSamples.length > 0 || sampleOptions.length === 0),
      canReceive:
        Boolean(nextActions.can_receive_sample) && receivableSamples.length > 0,
      canReject: rejectableSamples.length > 0,
      canRelease:
        Boolean(nextActions.can_release_result) && releasableItems.length > 0,
    };
  }, [orderItemOptions, sampleOptions, selectedWorkflow?.next_actions]);

  const selectedSummary = useMemo(() => {
    const order = selectedWorkflow?.order || null;
    return {
      orderId: toIdentifier(order?.id),
      patientName: sanitize(order?.patient_display_name),
      patientId: toIdentifier(order?.patient_id),
      encounterId: toIdentifier(order?.encounter_id),
      status: sanitize(order?.status),
      orderedAt: sanitize(order?.ordered_at),
      itemCount: Number(order?.item_count || 0),
      sampleCount: Number(order?.sample_count || 0),
    };
  }, [selectedWorkflow?.order]);

  const timelineItems = useMemo(
    () =>
      (Array.isArray(selectedWorkflow?.timeline) ? selectedWorkflow.timeline : [])
        .slice(0, 25)
        .map((entry, index) => {
          const timestamp = new Date(entry?.at).getTime();
          return {
            id: `${sanitize(entry?.id || entry?.type)}-${index + 1}`,
            label: sanitize(entry?.label || entry?.type) || t('common.notAvailable'),
            timestamp: Number.isFinite(timestamp)
              ? new Date(timestamp).toLocaleString()
              : sanitize(entry?.at) || t('common.notAvailable'),
          };
        }),
    [selectedWorkflow?.timeline, t]
  );

  const summaryCards = useMemo(
    () => [
      { id: 'total', label: t('lab.workbench.summary.totalOrders'), value: Number(summary.total_orders || 0) },
      { id: 'collection', label: t('lab.workbench.summary.collectionQueue'), value: Number(summary.collection_queue || 0) },
      { id: 'processing', label: t('lab.workbench.summary.processingQueue'), value: Number(summary.processing_queue || 0) },
      { id: 'results', label: t('lab.workbench.summary.resultsQueue'), value: Number(summary.results_queue || 0) },
      { id: 'critical', label: t('lab.workbench.summary.criticalResults'), value: Number(summary.critical_results || 0) },
      { id: 'completed', label: t('lab.workbench.summary.completedOrders'), value: Number(summary.completed_orders || 0) },
      { id: 'cancelled', label: t('lab.workbench.summary.cancelledOrders'), value: Number(summary.cancelled_orders || 0) },
      { id: 'rejected', label: t('lab.workbench.summary.rejectedSamples'), value: Number(summary.rejected_samples || 0) },
    ],
    [summary, t]
  );

  const onCollect = useCallback(async () => {
    const orderId = toIdentifier(selectedOrderId);
    if (!orderId) return;
    if (!actionMatrix.canCollect) {
      setFormError(t('lab.workbench.validation.collectNotAllowed'));
      return;
    }

    const payload = {
      sample_id: toIdentifier(collectDraft.sample_id) || undefined,
      collected_at: toIso(collectDraft.collected_at) || new Date().toISOString(),
      notes: sanitize(collectDraft.notes) || undefined,
    };

    const result = await runMutation(() => collect(orderId, payload), {
      refreshQueue: true,
    });
    if (result) {
      setCollectDraft((previous) => ({ ...previous, notes: '' }));
    }
  }, [actionMatrix.canCollect, collect, collectDraft, runMutation, selectedOrderId, t]);

  const onReceive = useCallback(async () => {
    const sampleId = toIdentifier(receiveDraft.sample_id);
    if (!sampleId) {
      setFormError(t('lab.workbench.validation.sampleRequired'));
      return;
    }
    if (!actionMatrix.canReceive) {
      setFormError(t('lab.workbench.validation.receiveNotAllowed'));
      return;
    }

    const payload = {
      received_at: toIso(receiveDraft.received_at) || new Date().toISOString(),
      notes: sanitize(receiveDraft.notes) || undefined,
    };

    const result = await runMutation(() => receive(sampleId, payload), {
      refreshQueue: true,
    });
    if (result) {
      setReceiveDraft((previous) => ({ ...previous, notes: '' }));
    }
  }, [actionMatrix.canReceive, receive, receiveDraft, runMutation, t]);

  const onReject = useCallback(async () => {
    const sampleId = toIdentifier(rejectDraft.sample_id);
    if (!sampleId) {
      setFormError(t('lab.workbench.validation.sampleRequired'));
      return;
    }
    if (!actionMatrix.canReject) {
      setFormError(t('lab.workbench.validation.rejectNotAllowed'));
      return;
    }

    const reason = sanitize(rejectDraft.reason);
    if (!reason) {
      setFormError(t('lab.workbench.validation.rejectReasonRequired'));
      return;
    }

    const payload = {
      reason,
      notes: sanitize(rejectDraft.notes) || undefined,
    };

    const result = await runMutation(() => reject(sampleId, payload), {
      refreshQueue: true,
    });
    if (result) {
      setRejectDraft((previous) => ({ ...previous, notes: '' }));
    }
  }, [actionMatrix.canReject, reject, rejectDraft, runMutation, t]);

  const onRelease = useCallback(async () => {
    const orderItemId = toIdentifier(releaseDraft.order_item_id);
    if (!orderItemId) {
      setFormError(t('lab.workbench.validation.orderItemRequired'));
      return;
    }
    if (!actionMatrix.canRelease) {
      setFormError(t('lab.workbench.validation.releaseNotAllowed'));
      return;
    }

    const payload = {
      result_id: toIdentifier(releaseDraft.result_id) || undefined,
      status: sanitize(releaseDraft.status).toUpperCase() || undefined,
      result_value: sanitize(releaseDraft.result_value) || undefined,
      result_unit: sanitize(releaseDraft.result_unit) || undefined,
      result_text: sanitize(releaseDraft.result_text) || undefined,
      reported_at: toIso(releaseDraft.reported_at) || new Date().toISOString(),
      notes: sanitize(releaseDraft.notes) || undefined,
    };

    const result = await runMutation(() => release(orderItemId, payload), {
      refreshQueue: true,
    });
    if (result) {
      setReleaseDraft((previous) => ({
        ...previous,
        result_value: '',
        result_text: '',
        notes: '',
      }));
    }
  }, [actionMatrix.canRelease, release, releaseDraft, runMutation, t]);

  const onSelectOrder = useCallback(
    (order) => {
      const id = toIdentifier(order?.id || order?.display_id);
      if (!id) return;
      setSelectedOrderId(id);
      syncSelectedUrl(id);
      if (selectedWorkflow?.order?.id !== id) {
        setSelectedWorkflow((previous) =>
          previous && toIdentifier(previous?.order?.id) === id
            ? previous
            : { order, results: [], timeline: [], next_actions: {} }
        );
      }
    },
    [selectedWorkflow?.order?.id, syncSelectedUrl]
  );

  const onClearFilters = useCallback(() => {
    setSearchText('');
    setStageFilter('ALL');
    setStatusFilter('');
    setCriticalityFilter('ALL');
  }, []);

  const onOpenPatientProfile = useCallback(() => {
    const patientId = toIdentifier(selectedWorkflow?.order?.patient_id);
    if (!patientId) return;
    router.push(`/patients/patients/${encodeURIComponent(patientId)}`);
  }, [router, selectedWorkflow?.order?.patient_id]);

  const onOpenCreateOrder = useCallback(() => {
    const patientId =
      toIdentifier(selectedWorkflow?.order?.patient_id) || toIdentifier(requestedPatientId);
    const encounterId =
      toIdentifier(selectedWorkflow?.order?.encounter_id) ||
      toIdentifier(requestedEncounterId);
    const query = new URLSearchParams();
    if (patientId) query.set('patientId', patientId);
    if (encounterId) query.set('encounterId', encounterId);
    const suffix = query.toString();
    router.push(`/lab/orders/create${suffix ? `?${suffix}` : ''}`);
  }, [
    requestedEncounterId,
    requestedPatientId,
    router,
    selectedWorkflow?.order?.encounter_id,
    selectedWorkflow?.order?.patient_id,
  ]);

  return {
    isResolved,
    canViewWorkbench,
    canMutate,
    isOffline,
    isLoading: !isResolved || (isQueueLoading && worklist.length === 0),
    isQueueLoading,
    isWorkflowLoading,
    isCrudLoading,
    hasError: Boolean(errorCode),
    errorCode,
    summary,
    summaryCards,
    worklist,
    pagination,
    selectedOrderId,
    selectedWorkflow,
    selectedSummary,
    timelineItems,
    actionMatrix,
    sampleOptions,
    orderItemOptions,
    resultOptions,
    formError,
    searchText,
    stageFilter,
    statusFilter,
    criticalityFilter,
    collectDraft,
    receiveDraft,
    rejectDraft,
    releaseDraft,
    stageOptions: STAGE_OPTIONS,
    statusOptions: ORDER_STATUS_OPTIONS,
    criticalityOptions: CRITICALITY_OPTIONS,
    resultStatusOptions: RESULT_STATUS_OPTIONS,
    buildWorklistCountLabel,
    onSelectOrder,
    onClearFilters,
    onCollect,
    onReceive,
    onReject,
    onRelease,
    onRetry: () => {
      if (selectedOrderId) loadSelectedWorkflow();
      loadWorkbench(false);
    },
    onOpenPatientProfile,
    onOpenCreateOrder,
    onOpenOrderList: () => router.push('/lab/orders'),
    onOpenSampleList: () => router.push('/lab/samples'),
    onOpenResultList: () => router.push('/lab/results'),
    onOpenQcList: () => router.push('/lab/qc-logs'),
    onOpenTestList: () => router.push('/lab/tests'),
    onOpenPanelList: () => router.push('/lab/panels'),
    onSearchChange: setSearchText,
    onStageFilterChange: setStageFilter,
    onStatusFilterChange: setStatusFilter,
    onCriticalityFilterChange: setCriticalityFilter,
    onCollectDraftChange: (field, value) =>
      setCollectDraft((previous) => ({ ...previous, [field]: value })),
    onReceiveDraftChange: (field, value) =>
      setReceiveDraft((previous) => ({ ...previous, [field]: value })),
    onRejectDraftChange: (field, value) =>
      setRejectDraft((previous) => ({ ...previous, [field]: value })),
    onReleaseDraftChange: (field, value) =>
      setReleaseDraft((previous) => ({ ...previous, [field]: value })),
    currentUserId: toIdentifier(user?.human_friendly_id || user?.id),
  };
};

export default useLabWorkbenchScreen;
