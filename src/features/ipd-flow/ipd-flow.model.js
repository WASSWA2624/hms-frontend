/**
 * IPD Flow Model
 * File: ipd-flow.model.js
 */

const sanitizeString = (value) => String(value || '').trim();
const normalizeObject = (value) =>
  value && typeof value === 'object' && !Array.isArray(value) ? { ...value } : null;
const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const resolveRecordId = (record) => {
  if (!record) return null;
  if (typeof record === 'string' || typeof record === 'number') return String(record);
  return record.id || null;
};

const resolveRecordPublicId = (record) => {
  const objectRecord = normalizeObject(record);
  if (!objectRecord) return null;
  return objectRecord.human_friendly_id || objectRecord.humanFriendlyId || null;
};

const resolveDisplayId = (record) => resolveRecordPublicId(record) || resolveRecordId(record) || null;

const normalizeTimelineItem = (item) => {
  const row = normalizeObject(item);
  if (!row) return null;
  return {
    ...row,
    type: sanitizeString(row.type || row.event || 'ACTIVITY').toUpperCase(),
    at: sanitizeString(row.at || row.timestamp || row.created_at || row.round_at || row.administered_at),
    label: sanitizeString(row.label || row.title || row.note || row.notes),
  };
};

const toTimeline = (snapshot) => {
  const wardRounds = normalizeArray(snapshot?.ward_rounds).map((item) => ({
    type: 'WARD_ROUND',
    at: item?.round_at,
    label: item?.notes || 'Ward round recorded',
  }));

  const nursingNotes = normalizeArray(snapshot?.nursing_notes).map((item) => ({
    type: 'NURSING_NOTE',
    at: item?.created_at,
    label: item?.note || 'Nursing note recorded',
  }));

  const medicationAdministrations = normalizeArray(snapshot?.medication_administrations).map((item) => ({
    type: 'MEDICATION_ADMINISTRATION',
    at: item?.administered_at,
    label: item?.dose ? `Dose ${item.dose}${item.unit ? ` ${item.unit}` : ''}` : 'Medication administered',
  }));

  return [...wardRounds, ...nursingNotes, ...medicationAdministrations]
    .map(normalizeTimelineItem)
    .filter(Boolean)
    .sort((left, right) => {
      const leftDate = new Date(left.at).getTime() || 0;
      const rightDate = new Date(right.at).getTime() || 0;
      return rightDate - leftDate;
    });
};

const normalizeIpdFlowSnapshot = (value) => {
  const snapshot = normalizeObject(value);
  if (!snapshot) return null;

  const admission = normalizeObject(snapshot.admission) || {};
  const patient = normalizeObject(snapshot.patient) || null;
  const encounter = normalizeObject(snapshot.encounter) || null;
  const flow = normalizeObject(snapshot.flow) || {};
  const activeBedAssignment = normalizeObject(snapshot.active_bed_assignment) || null;
  const openTransferRequest = normalizeObject(snapshot.open_transfer_request) || null;
  const latestDischargeSummary = normalizeObject(snapshot.latest_discharge_summary) || null;

  return {
    ...snapshot,
    admission,
    patient,
    encounter,
    flow,
    active_bed_assignment: activeBedAssignment,
    open_transfer_request: openTransferRequest,
    latest_discharge_summary: latestDischargeSummary,
    id: resolveRecordId(admission),
    human_friendly_id: resolveRecordPublicId(admission),
    display_id: resolveDisplayId(admission),
    stage: sanitizeString(flow.stage),
    next_step: sanitizeString(flow.next_step) || null,
    patient_display_name:
      [sanitizeString(patient?.first_name), sanitizeString(patient?.last_name)]
        .filter(Boolean)
        .join(' ') ||
      resolveDisplayId(patient) ||
      'Unknown patient',
    patient_display_id: resolveDisplayId(patient),
    ward_display_name:
      sanitizeString(activeBedAssignment?.bed?.ward?.name) || sanitizeString(openTransferRequest?.to_ward?.name),
    transfer_status: sanitizeString(openTransferRequest?.status || flow.transfer_status),
    timeline: toTimeline(snapshot),
  };
};

const normalizeIpdFlowListItem = (value) => {
  const snapshot = normalizeIpdFlowSnapshot(value);
  if (!snapshot) return null;
  return {
    ...snapshot,
    has_active_bed: Boolean(snapshot.active_bed_assignment),
  };
};

const normalizeIpdFlowList = (value) => {
  if (Array.isArray(value)) {
    return {
      items: value.map(normalizeIpdFlowListItem).filter(Boolean),
      pagination: null,
    };
  }

  if (value && typeof value === 'object') {
    const items = normalizeArray(value.items).map(normalizeIpdFlowListItem).filter(Boolean);
    return {
      items,
      pagination: normalizeObject(value.pagination),
    };
  }

  return {
    items: [],
    pagination: null,
  };
};

export { normalizeIpdFlowSnapshot, normalizeIpdFlowList, normalizeIpdFlowListItem };
