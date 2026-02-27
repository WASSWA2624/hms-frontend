/**
 * Lab Workspace Model
 * File: lab-workspace.model.js
 */

const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const sanitizeString = (value) => String(value || '').trim();
const normalizeObject = (value) =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? { ...value }
    : null;
const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const toPublicId = (value) => {
  const normalized = sanitizeString(value);
  if (!normalized || UUID_LIKE_REGEX.test(normalized)) return null;
  return normalized;
};

const resolvePublicId = (...candidates) => {
  for (const candidate of candidates) {
    const normalized = toPublicId(candidate);
    if (normalized) return normalized;
  }
  return null;
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeOrderItem = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;
  const id = resolvePublicId(row.display_id, row.human_friendly_id, row.id);
  return {
    ...row,
    id,
    display_id: id,
    human_friendly_id: id,
    lab_order_id: resolvePublicId(
      row.lab_order_display_id,
      row.lab_order_human_friendly_id,
      row.lab_order_id
    ),
    lab_test_id: resolvePublicId(
      row.lab_test_display_id,
      row.lab_test_human_friendly_id,
      row.lab_test_id
    ),
    patient_id: resolvePublicId(
      row.patient_display_id,
      row.patient_human_friendly_id,
      row.patient_id
    ),
    status: sanitizeString(row.status).toUpperCase() || null,
    result_status: sanitizeString(row.result_status).toUpperCase() || null,
    patient_display_name: sanitizeString(row.patient_display_name) || '',
    test_display_name: sanitizeString(row.test_display_name) || '',
    test_code: sanitizeString(row.test_code) || '',
  };
};

const normalizeSample = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;
  const id = resolvePublicId(row.display_id, row.human_friendly_id, row.id);
  return {
    ...row,
    id,
    display_id: id,
    human_friendly_id: id,
    lab_order_id: resolvePublicId(
      row.lab_order_display_id,
      row.lab_order_human_friendly_id,
      row.lab_order_id
    ),
    patient_id: resolvePublicId(
      row.patient_display_id,
      row.patient_human_friendly_id,
      row.patient_id
    ),
    status: sanitizeString(row.status).toUpperCase() || null,
    patient_display_name: sanitizeString(row.patient_display_name) || '',
  };
};

const normalizeResult = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;
  const id = resolvePublicId(row.display_id, row.human_friendly_id, row.id);
  return {
    ...row,
    id,
    display_id: id,
    human_friendly_id: id,
    lab_order_item_id: resolvePublicId(
      row.lab_order_item_display_id,
      row.lab_order_item_human_friendly_id,
      row.lab_order_item_id
    ),
    lab_order_id: resolvePublicId(
      row.lab_order_display_id,
      row.lab_order_human_friendly_id,
      row.lab_order_id
    ),
    lab_test_id: resolvePublicId(
      row.lab_test_display_id,
      row.lab_test_human_friendly_id,
      row.lab_test_id
    ),
    patient_id: resolvePublicId(
      row.patient_display_id,
      row.patient_human_friendly_id,
      row.patient_id
    ),
    status: sanitizeString(row.status).toUpperCase() || null,
    result_value: sanitizeString(row.result_value) || '',
    result_unit: sanitizeString(row.result_unit) || '',
    result_text: sanitizeString(row.result_text) || '',
    patient_display_name: sanitizeString(row.patient_display_name) || '',
    test_display_name: sanitizeString(row.test_display_name) || '',
    test_code: sanitizeString(row.test_code) || '',
  };
};

const normalizeWorkbenchOrder = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;
  const id = resolvePublicId(row.display_id, row.human_friendly_id, row.id);

  const items = normalizeArray(row.items).map(normalizeOrderItem).filter(Boolean);
  const samples = normalizeArray(row.samples).map(normalizeSample).filter(Boolean);

  return {
    ...row,
    id,
    display_id: id,
    human_friendly_id: id,
    encounter_id: resolvePublicId(
      row.encounter_display_id,
      row.encounter_human_friendly_id,
      row.encounter_id
    ),
    patient_id: resolvePublicId(
      row.patient_display_id,
      row.patient_human_friendly_id,
      row.patient_id
    ),
    status: sanitizeString(row.status).toUpperCase() || null,
    patient_display_name: sanitizeString(row.patient_display_name) || '',
    item_count: toNumber(row.item_count),
    pending_item_count: toNumber(row.pending_item_count),
    in_process_item_count: toNumber(row.in_process_item_count),
    completed_item_count: toNumber(row.completed_item_count),
    sample_count: toNumber(row.sample_count),
    items,
    samples,
  };
};

const normalizeLabWorkbenchPayload = (value) => {
  const payload = normalizeObject(value) || {};
  const summary = normalizeObject(payload.summary) || {};
  const worklist = normalizeArray(payload.worklist)
    .map(normalizeWorkbenchOrder)
    .filter(Boolean);

  return {
    summary: {
      total_orders: toNumber(summary.total_orders),
      collection_queue: toNumber(summary.collection_queue),
      processing_queue: toNumber(summary.processing_queue),
      results_queue: toNumber(summary.results_queue),
      critical_results: toNumber(summary.critical_results),
      completed_orders: toNumber(summary.completed_orders),
      cancelled_orders: toNumber(summary.cancelled_orders),
      rejected_samples: toNumber(summary.rejected_samples),
    },
    worklist,
    pagination: normalizeObject(payload.pagination),
  };
};

const normalizeTimelineEntry = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;
  return {
    id:
      sanitizeString(row.id) ||
      `${sanitizeString(row.type || 'ACTIVITY')}-${sanitizeString(row.at || row.created_at)}`,
    type: sanitizeString(row.type || 'ACTIVITY').toUpperCase(),
    at: sanitizeString(row.at || row.created_at) || null,
    label: sanitizeString(row.label || row.title || row.type) || 'Activity',
  };
};

const normalizeLabWorkflowPayload = (value) => {
  const payload = normalizeObject(value) || {};
  const order = normalizeWorkbenchOrder(payload.order);
  const results = normalizeArray(payload.results).map(normalizeResult).filter(Boolean);
  const timeline = normalizeArray(payload.timeline)
    .map(normalizeTimelineEntry)
    .filter(Boolean)
    .sort((left, right) => {
      const leftTime = Date.parse(left.at || '') || 0;
      const rightTime = Date.parse(right.at || '') || 0;
      return rightTime - leftTime;
    });
  const nextActions = normalizeObject(payload.next_actions) || {};

  return {
    order,
    results,
    timeline,
    next_actions: {
      can_collect: Boolean(nextActions.can_collect),
      can_receive_sample: Boolean(nextActions.can_receive_sample),
      can_release_result: Boolean(nextActions.can_release_result),
    },
  };
};

const normalizeLabLegacyResolution = (value) => {
  const payload = normalizeObject(value);
  if (!payload) return null;
  const identifier = resolvePublicId(payload.identifier, payload.id);
  return {
    id: identifier,
    identifier,
    resource: sanitizeString(payload.resource).toLowerCase(),
    route: sanitizeString(payload.route) || '/lab',
    matched_by: sanitizeString(payload.matched_by).toLowerCase() || null,
  };
};

export {
  normalizeLabWorkbenchPayload,
  normalizeLabWorkflowPayload,
  normalizeLabLegacyResolution,
};
