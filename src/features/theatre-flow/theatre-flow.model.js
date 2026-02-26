/**
 * Theatre Flow Model
 * File: theatre-flow.model.js
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

const toDisplayText = (value) => {
  const normalized = sanitizeString(value);
  if (!normalized || UUID_LIKE_REGEX.test(normalized)) return '';
  return normalized;
};

const resolvePublicRecordId = (record) => {
  if (!record) return null;
  if (typeof record === 'string' || typeof record === 'number') {
    return toPublicId(record);
  }
  return (
    toPublicId(record.display_id) ||
    toPublicId(record.human_friendly_id) ||
    toPublicId(record.id) ||
    null
  );
};

const normalizeTimelineItem = (item) => {
  const row = normalizeObject(item);
  if (!row) return null;
  return {
    ...row,
    type: sanitizeString(row.type || 'ACTIVITY').toUpperCase(),
    at: sanitizeString(row.at || row.created_at),
    label: toDisplayText(row.label || row.notes || row.event || 'Activity'),
  };
};

const normalizeChecklistItem = (item) => {
  const row = normalizeObject(item);
  if (!row) return null;
  const displayId = resolvePublicRecordId(row);
  return {
    ...row,
    id: displayId,
    display_id: displayId,
    phase: sanitizeString(row.phase).toUpperCase(),
    item_code: sanitizeString(row.item_code),
    item_label: sanitizeString(row.item_label),
    checked_by_user_display_id: toPublicId(row.checked_by_user_display_id),
  };
};

const normalizeObservation = (item) => {
  const row = normalizeObject(item);
  if (!row) return null;
  const displayId = resolvePublicRecordId(row);
  return {
    ...row,
    id: displayId,
    display_id: displayId,
    observed_by_user_display_id: toPublicId(row.observed_by_user_display_id),
    observed_at: sanitizeString(row.observed_at || row.created_at),
  };
};

const normalizeResourceAllocation = (item) => {
  const row = normalizeObject(item);
  if (!row) return null;
  const displayId = resolvePublicRecordId(row);
  return {
    ...row,
    id: displayId,
    display_id: displayId,
    resource_type: sanitizeString(row.resource_type).toUpperCase(),
    resource_display_id: toPublicId(row.resource_display_id),
    resource_label: toDisplayText(row.resource_label),
    assigned_by_user_display_id: toPublicId(row.assigned_by_user_display_id),
    released_by_user_display_id: toPublicId(row.released_by_user_display_id),
  };
};

const normalizeAnesthesiaRecord = (item) => {
  const row = normalizeObject(item);
  if (!row) return null;
  const displayId = resolvePublicRecordId(row);
  return {
    ...row,
    id: displayId,
    display_id: displayId,
    theatre_case_display_id:
      toPublicId(row.theatre_case_display_id) ||
      toPublicId(row.theatre_case_id) ||
      null,
    anesthetist_user_display_id: toPublicId(row.anesthetist_user_display_id),
    staff_profile_display_id: toPublicId(row.staff_profile_display_id),
    anesthetist_display_name: toDisplayText(row.anesthetist_display_name),
    record_status: sanitizeString(row.record_status || 'DRAFT').toUpperCase(),
  };
};

const normalizePostOpNote = (item) => {
  const row = normalizeObject(item);
  if (!row) return null;
  const displayId = resolvePublicRecordId(row);
  return {
    ...row,
    id: displayId,
    display_id: displayId,
    theatre_case_display_id:
      toPublicId(row.theatre_case_display_id) ||
      toPublicId(row.theatre_case_id) ||
      null,
    note: sanitizeString(row.note),
    record_status: sanitizeString(row.record_status || 'DRAFT').toUpperCase(),
  };
};

const normalizeTheatreFlowSnapshot = (value) => {
  const snapshot = normalizeObject(value);
  if (!snapshot) return null;

  const displayId = resolvePublicRecordId(snapshot);
  const checklistItems = normalizeArray(snapshot.checklist_items)
    .map(normalizeChecklistItem)
    .filter(Boolean);
  const resourceAllocations = normalizeArray(snapshot.resource_allocations)
    .map(normalizeResourceAllocation)
    .filter(Boolean);
  const anesthesiaObservations = normalizeArray(snapshot.anesthesia_observations)
    .map(normalizeObservation)
    .filter(Boolean);
  const anesthesiaRecords = normalizeArray(snapshot.anesthesia_records)
    .map(normalizeAnesthesiaRecord)
    .filter(Boolean);
  const postOpNotes = normalizeArray(snapshot.post_op_notes)
    .map(normalizePostOpNote)
    .filter(Boolean);
  const timeline = normalizeArray(snapshot.timeline)
    .map(normalizeTimelineItem)
    .filter(Boolean)
    .sort((left, right) => {
      const leftDate = new Date(left.at).getTime() || 0;
      const rightDate = new Date(right.at).getTime() || 0;
      return rightDate - leftDate;
    });

  const latestAnesthesia =
    normalizeAnesthesiaRecord(snapshot.latest_anesthesia_record) ||
    anesthesiaRecords[0] ||
    null;
  const latestPostOp =
    normalizePostOpNote(snapshot.latest_post_op_note) ||
    postOpNotes[0] ||
    null;

  return {
    ...snapshot,
    id: displayId,
    display_id: displayId,
    human_friendly_id: displayId,
    theatre_case_display_id:
      toPublicId(snapshot.theatre_case_display_id) || displayId,
    encounter_display_id: toPublicId(snapshot.encounter_display_id),
    patient_display_id: toPublicId(snapshot.patient_display_id),
    patient_display_name: toDisplayText(snapshot.patient_display_name),
    room_display_id: toPublicId(snapshot.room_display_id),
    room_display_label: toDisplayText(snapshot.room_display_label),
    surgeon_user_display_id: toPublicId(snapshot.surgeon_user_display_id),
    surgeon_display_name: toDisplayText(snapshot.surgeon_display_name),
    anesthetist_user_display_id: toPublicId(
      snapshot.anesthetist_user_display_id
    ),
    anesthetist_display_name: toDisplayText(snapshot.anesthetist_display_name),
    anesthesia_record_display_id:
      toPublicId(snapshot.anesthesia_record_display_id) ||
      latestAnesthesia?.display_id ||
      null,
    post_op_note_display_id:
      toPublicId(snapshot.post_op_note_display_id) ||
      latestPostOp?.display_id ||
      null,
    stage: sanitizeString(snapshot.workflow_stage).toUpperCase(),
    status: sanitizeString(snapshot.status).toUpperCase(),
    anesthesia_status: sanitizeString(
      snapshot.anesthesia_status || latestAnesthesia?.record_status
    ).toUpperCase(),
    post_op_status: sanitizeString(
      snapshot.post_op_status || latestPostOp?.record_status
    ).toUpperCase(),
    checklist_items: checklistItems,
    resource_allocations: resourceAllocations,
    anesthesia_observations: anesthesiaObservations,
    anesthesia_records: anesthesiaRecords,
    post_op_notes: postOpNotes,
    latest_anesthesia_record: latestAnesthesia,
    latest_post_op_note: latestPostOp,
    timeline,
  };
};

const normalizeTheatreFlowListItem = (value) => {
  const normalized = normalizeTheatreFlowSnapshot(value);
  if (!normalized) return null;
  return normalized;
};

const normalizeTheatreFlowList = (value) => {
  if (Array.isArray(value)) {
    return {
      items: value.map(normalizeTheatreFlowListItem).filter(Boolean),
      pagination: null,
    };
  }

  if (value && typeof value === 'object') {
    return {
      items: normalizeArray(value.items)
        .map(normalizeTheatreFlowListItem)
        .filter(Boolean),
      pagination: normalizeObject(value.pagination),
    };
  }

  return { items: [], pagination: null };
};

const normalizeTheatreLegacyResolution = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;
  return {
    theatre_case_id: toPublicId(row.theatre_case_id),
    resource: sanitizeString(row.resource).toLowerCase(),
    resource_id: toPublicId(row.resource_id),
    panel: sanitizeString(row.panel).toLowerCase(),
    action: sanitizeString(row.action),
    stage_hint: sanitizeString(row.stage_hint).toUpperCase() || null,
  };
};

export {
  normalizeTheatreFlowSnapshot,
  normalizeTheatreFlowList,
  normalizeTheatreFlowListItem,
  normalizeTheatreLegacyResolution,
};
