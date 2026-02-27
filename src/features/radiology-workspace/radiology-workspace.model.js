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

const normalizeResultAttestation = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;
  const id = resolvePublicId(row.display_id, row.human_friendly_id, row.id);
  return {
    ...row,
    id,
    display_id: id,
    radiology_result_id: resolvePublicId(
      row.radiology_result_display_id,
      row.radiology_result_id
    ),
    phase: sanitizeString(row.phase).toUpperCase() || null,
    attested_by_user_id: resolvePublicId(row.attested_by_user_id),
    attested_role: sanitizeString(row.attested_role) || null,
    statement: sanitizeString(row.statement) || null,
    reason: sanitizeString(row.reason) || null,
  };
};

const normalizeAsset = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;
  const id = resolvePublicId(row.display_id, row.human_friendly_id, row.id);
  return {
    ...row,
    id,
    display_id: id,
    imaging_study_id: resolvePublicId(row.imaging_study_display_id, row.imaging_study_id),
    storage_key: sanitizeString(row.storage_key) || '',
    file_name: sanitizeString(row.file_name) || '',
    content_type: sanitizeString(row.content_type) || '',
  };
};

const normalizePacsLink = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;
  const id = resolvePublicId(row.display_id, row.human_friendly_id, row.id);
  return {
    ...row,
    id,
    display_id: id,
    imaging_study_id: resolvePublicId(row.imaging_study_display_id, row.imaging_study_id),
    url: sanitizeString(row.url) || '',
    expires_at: sanitizeString(row.expires_at) || null,
  };
};

const normalizeStudy = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;
  const id = resolvePublicId(row.display_id, row.human_friendly_id, row.id);
  return {
    ...row,
    id,
    display_id: id,
    radiology_order_id: resolvePublicId(row.radiology_order_display_id, row.radiology_order_id),
    modality: sanitizeString(row.modality).toUpperCase() || null,
    asset_count: toNumber(row.asset_count),
    pacs_link_count: toNumber(row.pacs_link_count),
    assets: normalizeArray(row.assets).map(normalizeAsset).filter(Boolean),
    pacs_links: normalizeArray(row.pacs_links).map(normalizePacsLink).filter(Boolean),
  };
};

const normalizeResult = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;
  const id = resolvePublicId(row.display_id, row.human_friendly_id, row.id);
  const finalization = normalizeObject(row.finalization) || {};
  const attestations = normalizeArray(row.attestations)
    .map(normalizeResultAttestation)
    .filter(Boolean);

  return {
    ...row,
    id,
    display_id: id,
    radiology_order_id: resolvePublicId(row.radiology_order_display_id, row.radiology_order_id),
    patient_id: resolvePublicId(row.patient_display_id, row.patient_id),
    radiology_test_id: resolvePublicId(row.radiology_test_display_id, row.radiology_test_id),
    status: sanitizeString(row.status).toUpperCase() || null,
    modality: sanitizeString(row.modality).toUpperCase() || null,
    report_text: sanitizeString(row.report_text) || '',
    finalization: {
      requested: Boolean(finalization.requested),
      requested_at: sanitizeString(finalization.requested_at) || null,
      requested_by_role: sanitizeString(finalization.requested_by_role) || null,
      attested: Boolean(finalization.attested),
      attested_at: sanitizeString(finalization.attested_at) || null,
      attested_by_role: sanitizeString(finalization.attested_by_role) || null,
      pending_attestation: Boolean(finalization.pending_attestation),
    },
    attestations,
  };
};

const normalizeWorkbenchOrder = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;
  const id = resolvePublicId(row.display_id, row.human_friendly_id, row.id);
  return {
    ...row,
    id,
    display_id: id,
    encounter_id: resolvePublicId(row.encounter_display_id, row.encounter_id),
    patient_id: resolvePublicId(row.patient_display_id, row.patient_id),
    radiology_test_id: resolvePublicId(row.radiology_test_display_id, row.radiology_test_id),
    status: sanitizeString(row.status).toUpperCase() || null,
    modality: sanitizeString(row.modality).toUpperCase() || null,
    patient_display_name: sanitizeString(row.patient_display_name) || '',
    test_display_name: sanitizeString(row.test_display_name) || '',
    study_count: toNumber(row.study_count),
    unsynced_study_count: toNumber(row.unsynced_study_count),
    result_count: toNumber(row.result_count),
    draft_result_count: toNumber(row.draft_result_count),
    final_result_count: toNumber(row.final_result_count),
    amended_result_count: toNumber(row.amended_result_count),
    imaging_studies: normalizeArray(row.imaging_studies).map(normalizeStudy).filter(Boolean),
    results: normalizeArray(row.results).map(normalizeResult).filter(Boolean),
  };
};

const normalizeRadiologyWorkbenchPayload = (value) => {
  const payload = normalizeObject(value) || {};
  const summary = normalizeObject(payload.summary) || {};
  const worklist = normalizeArray(payload.worklist)
    .map(normalizeWorkbenchOrder)
    .filter(Boolean);

  return {
    summary: {
      total_orders: toNumber(summary.total_orders),
      ordered_queue: toNumber(summary.ordered_queue),
      processing_queue: toNumber(summary.processing_queue),
      draft_reports: toNumber(summary.draft_reports),
      finalized_reports: toNumber(summary.finalized_reports),
      amended_reports: toNumber(summary.amended_reports),
      completed_orders: toNumber(summary.completed_orders),
      cancelled_orders: toNumber(summary.cancelled_orders),
      studies_total: toNumber(summary.studies_total),
      unsynced_studies: toNumber(summary.unsynced_studies),
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

const normalizeRadiologyWorkflowPayload = (value) => {
  const payload = normalizeObject(value) || {};
  const order = normalizeWorkbenchOrder(payload.order);
  const results = normalizeArray(payload.results).map(normalizeResult).filter(Boolean);
  const studies = normalizeArray(payload.studies).map(normalizeStudy).filter(Boolean);
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
    studies,
    timeline,
    next_actions: {
      can_assign: Boolean(nextActions.can_assign),
      can_start: Boolean(nextActions.can_start),
      can_complete: Boolean(nextActions.can_complete),
      can_cancel: Boolean(nextActions.can_cancel),
      can_create_study: Boolean(nextActions.can_create_study),
      can_create_draft_result: Boolean(nextActions.can_create_draft_result),
      can_finalize_result: Boolean(nextActions.can_finalize_result),
      can_request_finalization: Boolean(nextActions.can_request_finalization),
      can_attest_finalization: Boolean(nextActions.can_attest_finalization),
      can_add_addendum: Boolean(nextActions.can_add_addendum),
      can_pacs_sync: Boolean(nextActions.can_pacs_sync),
    },
  };
};

const normalizeRadiologyLegacyResolution = (value) => {
  const payload = normalizeObject(value);
  if (!payload) return null;
  const identifier = resolvePublicId(payload.identifier, payload.id);
  return {
    id: identifier,
    identifier,
    resource: sanitizeString(payload.resource).toLowerCase(),
    route: sanitizeString(payload.route) || '/radiology',
    matched_by: sanitizeString(payload.matched_by).toLowerCase() || null,
  };
};

export {
  normalizeRadiologyWorkbenchPayload,
  normalizeRadiologyWorkflowPayload,
  normalizeRadiologyLegacyResolution,
};
