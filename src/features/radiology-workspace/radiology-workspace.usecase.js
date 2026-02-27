import { handleError } from '@errors';
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';
import { radiologyWorkspaceApi } from './radiology-workspace.api';
import {
  normalizeRadiologyLegacyResolution,
  normalizeRadiologyWorkbenchPayload,
  normalizeRadiologyWorkflowPayload,
} from './radiology-workspace.model';
import {
  parseRadiologyWorkspaceListParams,
  parseRadiologyWorkspaceId,
  parseResolveRadiologyLegacyRouteParams,
  parseRadiologyWorkbenchRouteState,
  parseAssignRadiologyOrderPayload,
  parseStartRadiologyOrderPayload,
  parseCompleteRadiologyOrderPayload,
  parseCancelRadiologyOrderPayload,
  parseCreateRadiologyStudyPayload,
  parseInitUploadPayload,
  parseCommitUploadPayload,
  parseSyncStudyPayload,
  parseDraftResultPayload,
  parseFinalizeResultPayload,
  parseRequestFinalizationPayload,
  parseAttestFinalizationPayload,
  parseAddendumResultPayload,
} from './radiology-workspace.rules';

const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const sanitize = (value) => String(value || '').trim();
const sanitizeUpper = (value) => sanitize(value).toUpperCase();

const toPublicId = (...candidates) => {
  for (const candidate of candidates) {
    const normalized = sanitize(candidate);
    if (!normalized || UUID_LIKE_REGEX.test(normalized)) continue;
    return normalized.toUpperCase();
  }
  return null;
};

const asIsoOrNull = (value) => {
  const normalized = sanitize(value);
  if (!normalized) return null;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

const isWorkspaceRouteNotFound = (error) => {
  const code = sanitizeUpper(error?.code);
  const rawMessage = `${sanitize(error?.message)} ${sanitize(error?.safeMessage)}`.toLowerCase();
  if (code === 'NOT_FOUND') return true;
  return code === 'UNKNOWN_ERROR' && rawMessage.includes('not found');
};

const mapStageToStatus = (stage) => {
  const normalized = sanitizeUpper(stage);
  if (normalized === 'ORDERED') return 'ORDERED';
  if (normalized === 'PROCESSING') return 'IN_PROCESS';
  if (normalized === 'COMPLETED') return 'COMPLETED';
  if (normalized === 'CANCELLED') return 'CANCELLED';
  return null;
};

const listLegacyRadiologyOrders = async (params = {}) => {
  const fallbackStatus = sanitizeUpper(params.status) || mapStageToStatus(params.stage) || undefined;
  const query = {
    page: params.page || 1,
    limit: params.limit || 50,
    sort_by: params.sort_by || 'ordered_at',
    order: params.order || 'desc',
    search: params.search || undefined,
    patient_id: params.patient_id || undefined,
    encounter_id: params.encounter_id || undefined,
    status: fallbackStatus,
  };

  const response = await apiClient({
    url: `${endpoints.RADIOLOGY_ORDERS.LIST}${buildQueryString(query)}`,
    method: 'GET',
  });

  const rows = Array.isArray(response?.data) ? response.data : [];
  return {
    rows,
    pagination: response?.pagination || null,
  };
};

const mapLegacyOrder = (row) => {
  const orderId = toPublicId(row?.display_id, row?.human_friendly_id, row?.id);
  if (!orderId) return null;

  const patientId = toPublicId(
    row?.patient_display_id,
    row?.patient?.display_id,
    row?.patient?.human_friendly_id,
    row?.patient_id
  );
  const encounterId = toPublicId(
    row?.encounter_display_id,
    row?.encounter?.display_id,
    row?.encounter?.human_friendly_id,
    row?.encounter_id
  );
  const testId = toPublicId(
    row?.radiology_test_display_id,
    row?.radiology_test?.display_id,
    row?.radiology_test?.human_friendly_id,
    row?.radiology_test_id
  );
  const patientDisplayName =
    sanitize(row?.patient_display_name) ||
    [sanitize(row?.patient?.first_name), sanitize(row?.patient?.last_name)]
      .filter(Boolean)
      .join(' ');

  return {
    id: orderId,
    display_id: orderId,
    encounter_id: encounterId,
    patient_id: patientId,
    radiology_test_id: testId,
    status: sanitizeUpper(row?.status) || null,
    modality:
      sanitizeUpper(row?.modality) ||
      sanitizeUpper(row?.radiology_test?.modality) ||
      null,
    patient_display_name: patientDisplayName,
    test_display_name:
      sanitize(row?.test_display_name) ||
      sanitize(row?.radiology_test?.name) ||
      sanitize(row?.radiology_test?.code) ||
      '',
    ordered_at: asIsoOrNull(row?.ordered_at || row?.created_at),
    study_count: Number(row?.study_count || 0),
    unsynced_study_count: Number(row?.unsynced_study_count || 0),
    result_count: Number(row?.result_count || 0),
    draft_result_count: Number(row?.draft_result_count || 0),
    final_result_count: Number(row?.final_result_count || 0),
    amended_result_count: Number(row?.amended_result_count || 0),
    imaging_studies: [],
    results: [],
  };
};

const buildLegacySummary = (worklist = [], pagination = null) => {
  const counters = worklist.reduce(
    (acc, order) => {
      const status = sanitizeUpper(order?.status);
      if (status === 'ORDERED') acc.ordered += 1;
      if (status === 'IN_PROCESS') acc.processing += 1;
      if (status === 'COMPLETED') acc.completed += 1;
      if (status === 'CANCELLED') acc.cancelled += 1;
      return acc;
    },
    { ordered: 0, processing: 0, completed: 0, cancelled: 0 }
  );

  const total = Number(pagination?.total || worklist.length || 0);
  return {
    total_orders: total,
    ordered_queue: counters.ordered,
    processing_queue: counters.processing,
    draft_reports: 0,
    finalized_reports: 0,
    amended_reports: 0,
    completed_orders: counters.completed,
    cancelled_orders: counters.cancelled,
    studies_total: 0,
    unsynced_studies: 0,
  };
};

const listRadiologyWorkbenchFromLegacy = async (params = {}) => {
  const { rows, pagination } = await listLegacyRadiologyOrders(params);
  const worklist = rows.map(mapLegacyOrder).filter(Boolean);
  return normalizeRadiologyWorkbenchPayload({
    summary: buildLegacySummary(worklist, pagination),
    worklist,
    pagination: pagination || null,
  });
};

const fetchLegacyResourceList = async (url, params = {}) => {
  const response = await apiClient({
    url: `${url}${buildQueryString(params)}`,
    method: 'GET',
  });
  return Array.isArray(response?.data) ? response.data : [];
};

const mapLegacyResult = (row, orderId) => {
  const resultId = toPublicId(row?.display_id, row?.human_friendly_id, row?.id);
  if (!resultId) return null;

  return {
    id: resultId,
    display_id: resultId,
    radiology_order_id: orderId,
    patient_id: null,
    radiology_test_id: null,
    status: sanitizeUpper(row?.status) || null,
    modality: sanitizeUpper(row?.modality) || null,
    report_text: sanitize(row?.report_text),
    reported_at: asIsoOrNull(row?.reported_at || row?.updated_at || row?.created_at),
  };
};

const mapLegacyStudy = (row, orderId) => {
  const studyId = toPublicId(row?.display_id, row?.human_friendly_id, row?.id);
  if (!studyId) return null;

  return {
    id: studyId,
    display_id: studyId,
    radiology_order_id: orderId,
    modality: sanitizeUpper(row?.modality) || null,
    performed_at: asIsoOrNull(row?.performed_at || row?.created_at),
    asset_count: Number(row?.asset_count || 0),
    pacs_link_count: Number(row?.pacs_link_count || 0),
    assets: [],
    pacs_links: [],
  };
};

const deriveLegacyNextActions = (orderStatus, results = [], studies = []) => {
  const status = sanitizeUpper(orderStatus);
  const hasDraft = results.some((result) => sanitizeUpper(result?.status) === 'DRAFT');
  const hasFinal = results.some((result) => sanitizeUpper(result?.status) === 'FINAL');

  return {
    can_assign: status !== 'CANCELLED',
    can_start: status === 'ORDERED',
    can_complete: status === 'IN_PROCESS',
    can_cancel: status !== 'COMPLETED' && status !== 'CANCELLED',
    can_create_study: status !== 'CANCELLED',
    can_create_draft_result: status !== 'CANCELLED',
    can_finalize_result: hasDraft,
    can_add_addendum: hasFinal,
    can_pacs_sync: studies.length > 0,
  };
};

const buildLegacyTimeline = (order = null, studies = [], results = []) => {
  const timeline = [];

  const orderedAt = asIsoOrNull(order?.ordered_at || order?.created_at);
  if (orderedAt) {
    timeline.push({
      id: `ORDERED-${orderedAt}`,
      type: 'ORDER',
      at: orderedAt,
      label: 'Order placed',
    });
  }

  studies.forEach((study) => {
    if (!study?.performed_at) return;
    timeline.push({
      id: `STUDY-${study.id}-${study.performed_at}`,
      type: 'STUDY',
      at: study.performed_at,
      label: `Study captured (${study.modality || 'OTHER'})`,
    });
  });

  results.forEach((result) => {
    if (!result?.reported_at) return;
    timeline.push({
      id: `RESULT-${result.id}-${result.reported_at}`,
      type: 'RESULT',
      at: result.reported_at,
      label: `Report ${sanitizeUpper(result.status || 'UPDATED')}`,
    });
  });

  return timeline.sort((left, right) => {
    const leftTime = Date.parse(left?.at || '') || 0;
    const rightTime = Date.parse(right?.at || '') || 0;
    return rightTime - leftTime;
  });
};

const getRadiologyOrderWorkflowFromLegacy = async (id) => {
  const parsedId = parseRadiologyWorkspaceId(id);

  const [orderResponse, legacyResults, legacyStudies] = await Promise.all([
    apiClient({
      url: endpoints.RADIOLOGY_ORDERS.GET(parsedId),
      method: 'GET',
    }),
    fetchLegacyResourceList(endpoints.RADIOLOGY_RESULTS.LIST, {
      page: 1,
      limit: 200,
      sort_by: 'reported_at',
      order: 'desc',
      radiology_order_id: parsedId,
    }),
    fetchLegacyResourceList(endpoints.IMAGING_STUDIES.LIST, {
      page: 1,
      limit: 200,
      sort_by: 'performed_at',
      order: 'desc',
      radiology_order_id: parsedId,
    }),
  ]);

  const mappedOrder = mapLegacyOrder(orderResponse?.data);
  if (!mappedOrder) {
    throw {
      code: 'NOT_FOUND',
      message: 'Radiology order not found',
    };
  }

  const mappedResults = legacyResults
    .map((entry) => mapLegacyResult(entry, mappedOrder.id))
    .filter(Boolean);
  const mappedStudies = legacyStudies
    .map((entry) => mapLegacyStudy(entry, mappedOrder.id))
    .filter(Boolean);

  const workflow = {
    order: {
      ...mappedOrder,
      study_count: mappedStudies.length,
      unsynced_study_count: mappedStudies.length,
      result_count: mappedResults.length,
      draft_result_count: mappedResults.filter((result) => result.status === 'DRAFT').length,
      final_result_count: mappedResults.filter((result) => result.status === 'FINAL').length,
      amended_result_count: mappedResults.filter((result) => result.status === 'AMENDED').length,
    },
    results: mappedResults,
    studies: mappedStudies,
    timeline: buildLegacyTimeline(orderResponse?.data, mappedStudies, mappedResults),
    next_actions: deriveLegacyNextActions(mappedOrder.status, mappedResults, mappedStudies),
  };

  return normalizeRadiologyWorkflowPayload(workflow);
};

const resolveRadiologyLegacyRouteFromFallback = (resource, id) => {
  const parsed = parseResolveRadiologyLegacyRouteParams({ resource, id });
  const safeIdentifier = sanitize(parsed.id);

  return normalizeRadiologyLegacyResolution({
    id: safeIdentifier,
    identifier: safeIdentifier,
    resource: parsed.resource,
    route: `/radiology?id=${encodeURIComponent(safeIdentifier)}`,
    matched_by: 'legacy',
  });
};

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listRadiologyWorkbench = async (params = {}) => {
  const parsed = parseRadiologyWorkspaceListParams(params);

  try {
    const response = await radiologyWorkspaceApi.listWorkbench(parsed);
    return normalizeRadiologyWorkbenchPayload(response.data);
  } catch (error) {
    if (isWorkspaceRouteNotFound(error)) {
      return listRadiologyWorkbenchFromLegacy(parsed);
    }
    const normalized = handleError(error);
    if (isWorkspaceRouteNotFound(normalized)) return listRadiologyWorkbenchFromLegacy(parsed);
    throw normalized;
  }
};

const getRadiologyOrderWorkflow = async (id) => {
  const parsedId = parseRadiologyWorkspaceId(id);

  try {
    const response = await radiologyWorkspaceApi.getOrderWorkflow(parsedId);
    return normalizeRadiologyWorkflowPayload(response.data);
  } catch (error) {
    if (isWorkspaceRouteNotFound(error)) {
      return getRadiologyOrderWorkflowFromLegacy(parsedId);
    }
    const normalized = handleError(error);
    if (isWorkspaceRouteNotFound(normalized)) return getRadiologyOrderWorkflowFromLegacy(parsedId);
    throw normalized;
  }
};

const resolveRadiologyLegacyRoute = async (resource, id) => {
  const parsed = parseResolveRadiologyLegacyRouteParams({ resource, id });

  try {
    const response = await radiologyWorkspaceApi.resolveLegacyRoute(
      parsed.resource,
      parsed.id
    );
    return normalizeRadiologyLegacyResolution(response.data);
  } catch (error) {
    if (isWorkspaceRouteNotFound(error)) {
      return resolveRadiologyLegacyRouteFromFallback(parsed.resource, parsed.id);
    }
    const normalized = handleError(error);
    if (isWorkspaceRouteNotFound(normalized)) {
      return resolveRadiologyLegacyRouteFromFallback(parsed.resource, parsed.id);
    }
    throw normalized;
  }
};

const assignRadiologyOrder = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseAssignRadiologyOrderPayload(payload);
    const response = await radiologyWorkspaceApi.assignOrder(parsedId, parsedPayload);
    return {
      workflow: normalizeRadiologyWorkflowPayload(response.data?.workflow),
      assignment: response.data?.assignment || null,
    };
  });

const startRadiologyOrder = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseStartRadiologyOrderPayload(payload);
    const response = await radiologyWorkspaceApi.startOrder(parsedId, parsedPayload);
    return {
      workflow: normalizeRadiologyWorkflowPayload(response.data?.workflow),
    };
  });

const completeRadiologyOrder = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseCompleteRadiologyOrderPayload(payload);
    const response = await radiologyWorkspaceApi.completeOrder(parsedId, parsedPayload);
    return {
      workflow: normalizeRadiologyWorkflowPayload(response.data?.workflow),
    };
  });

const cancelRadiologyOrder = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseCancelRadiologyOrderPayload(payload);
    const response = await radiologyWorkspaceApi.cancelOrder(parsedId, parsedPayload);
    return {
      workflow: normalizeRadiologyWorkflowPayload(response.data?.workflow),
    };
  });

const createRadiologyStudy = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseCreateRadiologyStudyPayload(payload);
    const response = await radiologyWorkspaceApi.createStudy(parsedId, parsedPayload);
    return {
      workflow: normalizeRadiologyWorkflowPayload(response.data?.workflow),
      study: response.data?.study || null,
    };
  });

const initStudyAssetUpload = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseInitUploadPayload(payload);
    const response = await radiologyWorkspaceApi.initAssetUpload(parsedId, parsedPayload);
    return response.data || null;
  });

const commitStudyAssetUpload = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseCommitUploadPayload(payload);
    const response = await radiologyWorkspaceApi.commitAssetUpload(parsedId, parsedPayload);
    return {
      workflow: normalizeRadiologyWorkflowPayload(response.data?.workflow),
      asset: response.data?.asset || null,
    };
  });

const syncRadiologyStudy = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseSyncStudyPayload(payload);
    const response = await radiologyWorkspaceApi.syncStudyToPacs(parsedId, parsedPayload);
    return {
      workflow: normalizeRadiologyWorkflowPayload(response.data?.workflow),
      sync_status: response.data?.sync_status || null,
      pacs_link: response.data?.pacs_link || null,
      error: response.data?.error || null,
      response: response.data?.response || null,
    };
  });

const draftRadiologyResult = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseDraftResultPayload(payload);
    const response = await radiologyWorkspaceApi.draftResult(parsedId, parsedPayload);
    return {
      workflow: normalizeRadiologyWorkflowPayload(response.data?.workflow),
      result: response.data?.result || null,
    };
  });

const finalizeRadiologyResult = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseFinalizeResultPayload(payload);
    const response = await radiologyWorkspaceApi.finalizeResult(parsedId, parsedPayload);
    return {
      workflow: normalizeRadiologyWorkflowPayload(response.data?.workflow),
      result: response.data?.result || null,
    };
  });

const requestRadiologyResultFinalization = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseRequestFinalizationPayload(payload);
    const response = await radiologyWorkspaceApi.requestFinalizationResult(parsedId, parsedPayload);
    return {
      workflow: normalizeRadiologyWorkflowPayload(response.data?.workflow),
      result: response.data?.result || null,
    };
  });

const attestRadiologyResultFinalization = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseAttestFinalizationPayload(payload);
    const response = await radiologyWorkspaceApi.attestFinalizationResult(parsedId, parsedPayload);
    return {
      workflow: normalizeRadiologyWorkflowPayload(response.data?.workflow),
      result: response.data?.result || null,
    };
  });

const addendumRadiologyResult = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseAddendumResultPayload(payload);
    const response = await radiologyWorkspaceApi.addendumResult(parsedId, parsedPayload);
    return {
      workflow: normalizeRadiologyWorkflowPayload(response.data?.workflow),
      result: response.data?.result || null,
    };
  });

export {
  listRadiologyWorkbench,
  getRadiologyOrderWorkflow,
  resolveRadiologyLegacyRoute,
  assignRadiologyOrder,
  startRadiologyOrder,
  completeRadiologyOrder,
  cancelRadiologyOrder,
  createRadiologyStudy,
  initStudyAssetUpload,
  commitStudyAssetUpload,
  syncRadiologyStudy,
  draftRadiologyResult,
  finalizeRadiologyResult,
  requestRadiologyResultFinalization,
  attestRadiologyResultFinalization,
  addendumRadiologyResult,
  parseRadiologyWorkbenchRouteState,
};
