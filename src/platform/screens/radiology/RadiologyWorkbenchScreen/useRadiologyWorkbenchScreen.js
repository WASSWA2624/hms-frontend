import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SCOPE_KEYS } from '@config/accessPolicy';
import { parseRadiologyWorkbenchRouteState } from '@features/radiology-workspace';
import {
  useAuth,
  useI18n,
  useNetwork,
  useRadiologyWorkspace,
  useRealtimeEvent,
  useScopeAccess,
} from '@hooks';

const SESSION = { search: '', stage: 'ALL', status: '', modality: '' };
const STAGE_OPTIONS = ['ALL', 'ORDERED', 'PROCESSING', 'REPORTING', 'COMPLETED', 'CANCELLED'];
const STATUS_OPTIONS = ['', 'ORDERED', 'IN_PROCESS', 'COMPLETED', 'CANCELLED'];
const MODALITY_OPTIONS = ['', 'XRAY', 'CT', 'MRI', 'ULTRASOUND', 'PET', 'ECG', 'ECHO', 'ENDO', 'GASTRO', 'OTHER'];
const TEMPLATE = Object.freeze({
  XRAY: { findings: 'No acute radiographic abnormality.', impression: 'No acute finding.' },
  CT: { findings: 'No acute CT abnormality identified.', impression: 'No acute CT finding.' },
  MRI: { findings: 'No acute MRI abnormality identified.', impression: 'No acute MRI finding.' },
  ULTRASOUND: { findings: 'No acute sonographic abnormality identified.', impression: 'No acute ultrasound finding.' },
  OTHER: { findings: 'Imaging findings recorded.', impression: 'Clinical correlation recommended.' },
});

const sanitize = (v) => String(v || '').trim();
const norm = (v) => (Array.isArray(v) ? sanitize(v[0]) : sanitize(v));
const asId = (v) => sanitize(v);
const asIso = (v) => {
  const n = sanitize(v);
  if (!n) return undefined;
  const d = new Date(n);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
};
const asLocalDateTime = (value = new Date()) => {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day}T${h}:${min}`;
};
const fmt = (value) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? sanitize(value) : d.toLocaleString();
};
const summaryDefaults = {
  total_orders: 0,
  ordered_queue: 0,
  processing_queue: 0,
  draft_reports: 0,
  finalized_reports: 0,
  amended_reports: 0,
  completed_orders: 0,
  cancelled_orders: 0,
  studies_total: 0,
  unsynced_studies: 0,
};
const draftDefaults = (currentUserId = '') => ({
  assign: { assignee_user_id: asId(currentUserId), notes: '' },
  study: { modality: '', performed_at: asLocalDateTime(), notes: '' },
  asset: { study_id: '', file_name: '', content_type: 'application/dicom' },
  sync: { study_id: '', study_uid: '', notes: '' },
  report: { findings: '', impression: '', report_text: '', reported_at: asLocalDateTime() },
  finalize: { result_id: '', report_text: '', reported_at: asLocalDateTime(), notes: '' },
  addendum: { result_id: '', addendum_text: '', reported_at: asLocalDateTime(), notes: '' },
  cancel: { reason: '', cancelled_at: asLocalDateTime(), notes: '' },
});

const useRadiologyWorkbenchScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const { isOffline } = useNetwork();
  const { canRead, canWrite, canManageAllTenants, tenantId, isResolved } =
    useScopeAccess(SCOPE_KEYS.RADIOLOGY);
  const workspace = useRadiologyWorkspace();
  const currentUserId = asId(user?.human_friendly_id || user?.id);

  const [summary, setSummary] = useState(summaryDefaults);
  const [worklist, setWorklist] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [searchText, setSearchText] = useState(SESSION.search);
  const [debouncedSearch, setDebouncedSearch] = useState(SESSION.search);
  const [stageFilter, setStageFilter] = useState(SESSION.stage);
  const [statusFilter, setStatusFilter] = useState(SESSION.status);
  const [modalityFilter, setModalityFilter] = useState(SESSION.modality);
  const [drafts, setDrafts] = useState(() => draftDefaults(currentUserId));
  const [isQueueLoading, setIsQueueLoading] = useState(false);
  const [isWorkflowLoading, setIsWorkflowLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [lastSyncStatus, setLastSyncStatus] = useState('');
  const [lastSyncError, setLastSyncError] = useState('');
  const realtimeTickRef = useRef(0);

  const parsedRouteState = useMemo(() => {
    try {
      return parseRadiologyWorkbenchRouteState(params || {});
    } catch (_error) {
      return {};
    }
  }, [params]);
  const requestedOrderId = norm(parsedRouteState?.id);
  const requestedLegacyResource = norm(parsedRouteState?.resource).toLowerCase();
  const requestedLegacyId = norm(parsedRouteState?.legacyId);
  const hasScope = canManageAllTenants || Boolean(asId(tenantId));
  const canViewWorkbench = isResolved && canRead && hasScope;
  const canMutate = canWrite && !isOffline;

  const setDraftField = useCallback((section, field, value) => {
    setDrafts((previous) => ({
      ...previous,
      [section]: { ...previous[section], [field]: value },
    }));
  }, []);

  const buildQueryUrl = useCallback((id, extras = {}) => {
    const query = new URLSearchParams();
    if (asId(id)) query.set('id', asId(id));
    Object.entries(extras).forEach(([k, v]) => {
      if (sanitize(v)) query.set(k, sanitize(v));
    });
    const q = query.toString();
    return `/radiology${q ? `?${q}` : ''}`;
  }, []);

  const upsertOrder = useCallback((order) => {
    const id = asId(order?.id || order?.display_id);
    if (!id) return;
    setWorklist((previous) => {
      const index = previous.findIndex(
        (entry) => asId(entry?.id || entry?.display_id).toUpperCase() === id.toUpperCase()
      );
      if (index < 0) return [order, ...previous];
      const next = [...previous];
      next[index] = { ...next[index], ...order };
      return next;
    });
  }, []);

  const applyWorkflow = useCallback((workflow) => {
    const order = workflow?.order || null;
    const id = asId(order?.id || order?.display_id);
    setSelectedWorkflow(workflow || null);
    if (id) {
      setSelectedOrderId(id);
      upsertOrder(order);
    }
  }, [upsertOrder]);

  const buildListParams = useCallback(() => {
    const next = { page: 1, limit: 50, sort_by: 'ordered_at', order: 'desc' };
    if (sanitize(debouncedSearch)) next.search = sanitize(debouncedSearch);
    if (sanitize(stageFilter) && sanitize(stageFilter).toUpperCase() !== 'ALL') next.stage = sanitize(stageFilter).toUpperCase();
    if (sanitize(statusFilter)) next.status = sanitize(statusFilter).toUpperCase();
    if (sanitize(modalityFilter)) next.modality = sanitize(modalityFilter).toUpperCase();
    return next;
  }, [debouncedSearch, stageFilter, statusFilter, modalityFilter]);

  const loadWorkbench = useCallback(async (light = false) => {
    if (!canViewWorkbench || isOffline) return;
    if (!light) {
      setIsQueueLoading(true);
      workspace.reset();
    }
    try {
      const payload = await workspace.listWorkbench(buildListParams());
      if (!payload) return;
      const list = Array.isArray(payload?.worklist) ? payload.worklist : [];
      setSummary(payload?.summary || summaryDefaults);
      setWorklist(list);
      setPagination(payload?.pagination || null);
      if (requestedOrderId) {
        setSelectedOrderId(requestedOrderId);
      } else if (!selectedOrderId && list.length > 0) {
        const first = asId(list[0]?.id || list[0]?.display_id);
        if (first) setSelectedOrderId(first);
      }
    } finally {
      if (!light) setIsQueueLoading(false);
    }
  }, [buildListParams, canViewWorkbench, isOffline, requestedOrderId, selectedOrderId, workspace]);

  const loadWorkflow = useCallback(async () => {
    if (!canViewWorkbench || isOffline) return;
    const id = asId(selectedOrderId);
    if (!id) {
      setSelectedWorkflow(null);
      return;
    }
    setIsWorkflowLoading(true);
    try {
      const workflow = await workspace.getWorkflow(id);
      if (workflow) applyWorkflow(workflow);
    } finally {
      setIsWorkflowLoading(false);
    }
  }, [applyWorkflow, canViewWorkbench, isOffline, selectedOrderId, workspace]);

  const mutate = useCallback(async (work, { refreshQueue = false } = {}) => {
    if (!canMutate) {
      setFormError(t('radiology.workbench.errors.readOnly'));
      return null;
    }
    setFormError('');
    const result = await work();
    if (!result) {
      setFormError(t('radiology.workbench.errors.actionFailed'));
      return null;
    }
    if (result.workflow) applyWorkflow(result.workflow);
    if (refreshQueue) await loadWorkbench(true);
    return result;
  }, [applyWorkflow, canMutate, loadWorkbench, t]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(sanitize(searchText)), 300);
    return () => clearTimeout(timer);
  }, [searchText]);
  useEffect(() => {
    SESSION.search = searchText;
    SESSION.stage = stageFilter;
    SESSION.status = statusFilter;
    SESSION.modality = modalityFilter;
  }, [searchText, stageFilter, statusFilter, modalityFilter]);
  useEffect(() => {
    if (requestedOrderId) setSelectedOrderId(requestedOrderId);
  }, [requestedOrderId]);
  useEffect(() => {
    loadWorkbench(false);
  }, [loadWorkbench]);
  useEffect(() => {
    loadWorkflow();
  }, [loadWorkflow]);

  useEffect(() => {
    if (!requestedLegacyId || !requestedLegacyResource || requestedOrderId) return;
    if (!canViewWorkbench || isOffline) return;
    workspace
      .resolveLegacyRoute(requestedLegacyResource, requestedLegacyId)
      .then((resolved) => {
        const id = asId(resolved?.identifier || resolved?.id);
        if (!id) return;
        router.replace(buildQueryUrl(id, { resource: requestedLegacyResource, legacyId: requestedLegacyId }));
      })
      .catch(() => {});
  }, [buildQueryUrl, canViewWorkbench, isOffline, requestedLegacyId, requestedLegacyResource, requestedOrderId, router, workspace]);

  const studies = useMemo(() => (Array.isArray(selectedWorkflow?.studies) ? selectedWorkflow.studies : []), [selectedWorkflow?.studies]);
  const results = useMemo(() => (Array.isArray(selectedWorkflow?.results) ? selectedWorkflow.results : []), [selectedWorkflow?.results]);
  const draftResults = useMemo(() => results.filter((r) => sanitize(r?.status).toUpperCase() === 'DRAFT'), [results]);
  const finalResults = useMemo(() => results.filter((r) => sanitize(r?.status).toUpperCase() === 'FINAL'), [results]);

  useEffect(() => {
    const order = selectedWorkflow?.order;
    if (!order) return;
    const orderModality = sanitize(order?.modality).toUpperCase() || 'OTHER';
    const study = studies.find((s) => Number(s?.pacs_link_count || 0) === 0) || studies[0];
    const studyId = asId(study?.id || study?.display_id);
    const draft = draftResults[0];
    const final = finalResults[0];
    const template = TEMPLATE[orderModality] || TEMPLATE.OTHER;
    setDrafts((prev) => ({
      ...prev,
      assign: { ...prev.assign, assignee_user_id: prev.assign.assignee_user_id || currentUserId },
      study: { ...prev.study, modality: prev.study.modality || orderModality },
      asset: {
        ...prev.asset,
        study_id: prev.asset.study_id || studyId,
        file_name: prev.asset.file_name || (studyId ? `${studyId.toLowerCase()}-image.dcm` : ''),
      },
      sync: { ...prev.sync, study_id: prev.sync.study_id || studyId },
      report: prev.report.findings || prev.report.impression || prev.report.report_text
        ? prev.report
        : {
            ...prev.report,
            findings: template.findings,
            impression: template.impression,
            report_text: sanitize(draft?.report_text || final?.report_text),
          },
      finalize: { ...prev.finalize, result_id: prev.finalize.result_id || asId(draft?.id || draft?.display_id) },
      addendum: { ...prev.addendum, result_id: prev.addendum.result_id || asId(final?.id || final?.display_id) },
    }));
  }, [currentUserId, draftResults, finalResults, selectedWorkflow?.order, studies]);

  const onRealtime = useCallback((payload = {}) => {
    const now = Date.now();
    if (now - realtimeTickRef.current < 500) return;
    realtimeTickRef.current = now;
    const workflow = payload?.workflow || null;
    const incomingOrderId = asId(payload?.order_public_id || payload?.order_id || workflow?.order?.id).toUpperCase();
    const activeOrderId = asId(selectedOrderId).toUpperCase();
    if (workflow?.order) {
      upsertOrder(workflow.order);
      if (incomingOrderId && activeOrderId && incomingOrderId === activeOrderId) applyWorkflow(workflow);
      return;
    }
    if (incomingOrderId && activeOrderId && incomingOrderId === activeOrderId) loadWorkflow();
    else loadWorkbench(true);
  }, [applyWorkflow, loadWorkbench, loadWorkflow, selectedOrderId, upsertOrder]);

  useRealtimeEvent('diagnostic.radiology_workflow_updated', onRealtime, { enabled: canViewWorkbench && !isOffline });
  useRealtimeEvent('diagnostic.radiology_result_updated', onRealtime, { enabled: canViewWorkbench && !isOffline });
  useRealtimeEvent('diagnostic.radiology_result_ready', onRealtime, { enabled: canViewWorkbench && !isOffline });

  const studyOptions = useMemo(() => studies.map((study) => {
    const id = asId(study?.id || study?.display_id);
    if (!id) return null;
    return { value: id, label: `${id} • ${sanitize(study?.modality).toUpperCase() || 'OTHER'} • ${sanitize(study?.performed_at) ? fmt(study?.performed_at) : t('common.notAvailable')}` };
  }).filter(Boolean), [studies, t]);
  const draftResultOptions = useMemo(() => draftResults.map((r) => {
    const id = asId(r?.id || r?.display_id);
    return id ? { value: id, label: `${id} • DRAFT` } : null;
  }).filter(Boolean), [draftResults]);
  const finalResultOptions = useMemo(() => finalResults.map((r) => {
    const id = asId(r?.id || r?.display_id);
    return id ? { value: id, label: `${id} • FINAL` } : null;
  }).filter(Boolean), [finalResults]);

  const nextActions = selectedWorkflow?.next_actions || {};
  const actionMatrix = {
    canAssign: Boolean(nextActions.can_assign),
    canStart: Boolean(nextActions.can_start),
    canComplete: Boolean(nextActions.can_complete),
    canCancel: Boolean(nextActions.can_cancel),
    canCreateStudy: Boolean(nextActions.can_create_study),
    canCaptureAsset: studyOptions.length > 0,
    canSyncStudy: Boolean(nextActions.can_pacs_sync) && studyOptions.length > 0,
    canDraftResult: Boolean(nextActions.can_create_draft_result),
    canFinalizeResult: Boolean(nextActions.can_finalize_result) && draftResultOptions.length > 0,
    canAddendum: Boolean(nextActions.can_add_addendum) && finalResultOptions.length > 0,
  };

  const selectedSummary = useMemo(() => {
    const o = selectedWorkflow?.order || {};
    return {
      orderId: asId(o?.id || o?.display_id),
      patientName: sanitize(o?.patient_display_name),
      patientId: asId(o?.patient_id),
      encounterId: asId(o?.encounter_id),
      testName: sanitize(o?.test_display_name),
      modality: sanitize(o?.modality).toUpperCase(),
      status: sanitize(o?.status).toUpperCase(),
      orderedAt: sanitize(o?.ordered_at) ? fmt(o?.ordered_at) : '',
      resultCount: Number(o?.result_count || 0),
      studyCount: Number(o?.study_count || 0),
      unsyncedStudyCount: Number(o?.unsynced_study_count || 0),
    };
  }, [selectedWorkflow?.order]);

  const timelineItems = useMemo(() => (Array.isArray(selectedWorkflow?.timeline) ? selectedWorkflow.timeline : []).slice(0, 40).map((entry, index) => ({
    id: `${sanitize(entry?.id || entry?.type)}-${index + 1}`,
    label: sanitize(entry?.label || entry?.type) || t('common.notAvailable'),
    timestamp: sanitize(entry?.at) ? fmt(entry?.at) : t('common.notAvailable'),
  })), [selectedWorkflow?.timeline, t]);

  const summaryCards = [
    { id: 'total', label: t('radiology.workbench.summary.totalOrders'), value: Number(summary.total_orders || 0) },
    { id: 'ordered', label: t('radiology.workbench.summary.orderedQueue'), value: Number(summary.ordered_queue || 0) },
    { id: 'processing', label: t('radiology.workbench.summary.processingQueue'), value: Number(summary.processing_queue || 0) },
    { id: 'draft', label: t('radiology.workbench.summary.draftReports'), value: Number(summary.draft_reports || 0) },
    { id: 'finalized', label: t('radiology.workbench.summary.finalizedReports'), value: Number(summary.finalized_reports || 0) },
    { id: 'amended', label: t('radiology.workbench.summary.amendedReports'), value: Number(summary.amended_reports || 0) },
    { id: 'completed', label: t('radiology.workbench.summary.completedOrders'), value: Number(summary.completed_orders || 0) },
    { id: 'unsynced', label: t('radiology.workbench.summary.unsyncedStudies'), value: Number(summary.unsynced_studies || 0) },
  ];

  const mutateHandlers = {
    assign: async () =>
      mutate(
        () =>
          workspace.assignOrder(selectedOrderId, {
            assignee_user_id: asId(drafts.assign.assignee_user_id) || undefined,
            notes: sanitize(drafts.assign.notes) || undefined,
          }),
        { refreshQueue: true }
      ),
    start: async () =>
      mutate(
        () => workspace.startOrder(selectedOrderId, { started_at: new Date().toISOString() }),
        { refreshQueue: true }
      ),
    complete: async () =>
      mutate(
        () =>
          workspace.completeOrder(selectedOrderId, {
            completed_at: new Date().toISOString(),
          }),
        { refreshQueue: true }
      ),
    cancel: async () => {
      const reason = sanitize(drafts.cancel.reason);
      if (!reason) {
        setFormError(t('radiology.workbench.validation.cancelReasonRequired'));
        return null;
      }
      return mutate(
        () =>
          workspace.cancelOrder(selectedOrderId, {
            reason,
            cancelled_at: asIso(drafts.cancel.cancelled_at) || new Date().toISOString(),
            notes: sanitize(drafts.cancel.notes) || undefined,
          }),
        { refreshQueue: true }
      );
    },
    createStudy: async () =>
      mutate(
        () =>
          workspace.createStudy(selectedOrderId, {
            modality: sanitize(drafts.study.modality).toUpperCase() || undefined,
            performed_at: asIso(drafts.study.performed_at) || undefined,
            notes: sanitize(drafts.study.notes) || undefined,
          }),
        { refreshQueue: true }
      ),
    draft: async () => {
      const findings = sanitize(drafts.report.findings);
      const impression = sanitize(drafts.report.impression);
      const reportText = sanitize(drafts.report.report_text);
      if (!findings && !impression && !reportText) {
        setFormError(t('radiology.workbench.validation.reportRequired'));
        return null;
      }
      return mutate(
        () =>
          workspace.draftResult(selectedOrderId, {
            findings: findings || undefined,
            impression: impression || undefined,
            report_text: reportText || undefined,
            reported_at: asIso(drafts.report.reported_at) || new Date().toISOString(),
          }),
        { refreshQueue: true }
      );
    },
    finalize: async () =>
      mutate(
        () =>
          workspace.finalizeResult(drafts.finalize.result_id, {
            report_text: sanitize(drafts.finalize.report_text) || undefined,
            reported_at: asIso(drafts.finalize.reported_at) || new Date().toISOString(),
            notes: sanitize(drafts.finalize.notes) || undefined,
          }),
        { refreshQueue: true }
      ),
    addendum: async () => {
      const addendumText = sanitize(drafts.addendum.addendum_text);
      if (!addendumText) {
        setFormError(t('radiology.workbench.validation.addendumTextRequired'));
        return null;
      }
      return mutate(
        () =>
          workspace.addendumResult(drafts.addendum.result_id, {
            addendum_text: addendumText,
            reported_at: asIso(drafts.addendum.reported_at) || new Date().toISOString(),
            notes: sanitize(drafts.addendum.notes) || undefined,
          }),
        { refreshQueue: true }
      );
    },
  };

  const onCaptureAsset = useCallback(async () => {
    const studyId = asId(drafts.asset.study_id);
    const fileName = sanitize(drafts.asset.file_name) || `${studyId.toLowerCase()}-image.dcm`;
    const contentType = sanitize(drafts.asset.content_type) || 'application/dicom';
    const init = await mutate(() => workspace.initUpload(studyId, { file_name: fileName, content_type: contentType }));
    if (!init?.storage_key) {
      setFormError(t('radiology.workbench.validation.uploadInitFailed'));
      return;
    }
    await mutate(() => workspace.commitUpload(studyId, { storage_key: init.storage_key, file_name: fileName, content_type: contentType, upload_token: sanitize(init.upload_token) || undefined }), { refreshQueue: true });
  }, [drafts.asset.content_type, drafts.asset.file_name, drafts.asset.study_id, mutate, t, workspace]);

  const onSyncStudy = useCallback(async () => {
    const studyId = asId(drafts.sync.study_id);
    const result = await mutate(() => workspace.syncStudy(studyId, { study_uid: sanitize(drafts.sync.study_uid) || undefined, notes: sanitize(drafts.sync.notes) || undefined }), { refreshQueue: true });
    setLastSyncStatus(sanitize(result?.sync_status).toUpperCase());
    setLastSyncError(sanitize(result?.error));
  }, [drafts.sync.notes, drafts.sync.study_id, drafts.sync.study_uid, mutate, workspace]);

  const onSelectOrder = useCallback((order) => {
    const id = asId(order?.id || order?.display_id);
    if (!id) return;
    setSelectedOrderId(id);
    router.replace(buildQueryUrl(id));
    if (asId(selectedWorkflow?.order?.id) !== id) {
      setSelectedWorkflow({ order, results: [], studies: [], timeline: [], next_actions: {} });
    }
  }, [buildQueryUrl, router, selectedWorkflow?.order?.id]);

  return {
    isResolved,
    canViewWorkbench,
    canMutate,
    isOffline,
    isLoading: !isResolved || (isQueueLoading && worklist.length === 0),
    isQueueLoading,
    isWorkflowLoading,
    isCrudLoading: workspace.isLoading,
    hasError: Boolean(workspace.errorCode),
    errorCode: workspace.errorCode,
    summary,
    summaryCards,
    worklist,
    pagination,
    selectedOrderId,
    selectedWorkflow,
    selectedSummary,
    timelineItems,
    studies,
    results,
    studyOptions,
    draftResultOptions,
    finalResultOptions,
    actionMatrix,
    formError,
    lastSyncStatus,
    lastSyncError,
    searchText,
    stageFilter,
    statusFilter,
    modalityFilter,
    stageOptions: STAGE_OPTIONS,
    statusOptions: STATUS_OPTIONS,
    modalityOptions: MODALITY_OPTIONS,
    drafts,
    buildWorklistCountLabel: (order) => {
      const studiesCount = Number(order?.study_count || 0);
      const unsyncedCount = Number(order?.unsynced_study_count || 0);
      const reportsCount = Number(order?.result_count || 0);
      return `Studies ${studiesCount} | Unsynced ${unsyncedCount} | Reports ${reportsCount}`;
    },
    onSelectOrder,
    onClearFilters: () => {
      setSearchText('');
      setStageFilter('ALL');
      setStatusFilter('');
      setModalityFilter('');
    },
    onSearchChange: setSearchText,
    onStageFilterChange: setStageFilter,
    onStatusFilterChange: setStatusFilter,
    onModalityFilterChange: setModalityFilter,
    onDraftChange: setDraftField,
    onAssign: mutateHandlers.assign,
    onStart: mutateHandlers.start,
    onComplete: mutateHandlers.complete,
    onCancel: mutateHandlers.cancel,
    onCreateStudy: mutateHandlers.createStudy,
    onCaptureAsset,
    onSyncStudy,
    onDraftResult: mutateHandlers.draft,
    onFinalizeResult: mutateHandlers.finalize,
    onAddendumResult: mutateHandlers.addendum,
    onRetry: () => {
      if (selectedOrderId) loadWorkflow();
      loadWorkbench(false);
    },
    onOpenPatientProfile: () => {
      const patientId = asId(selectedWorkflow?.order?.patient_id);
      if (patientId) router.push(`/patients/patients/${encodeURIComponent(patientId)}`);
    },
    onOpenOrderRoute: () => {
      const orderId = asId(selectedOrderId);
      if (orderId) router.push(`/radiology/${encodeURIComponent(orderId)}`);
    },
  };
};

export default useRadiologyWorkbenchScreen;
