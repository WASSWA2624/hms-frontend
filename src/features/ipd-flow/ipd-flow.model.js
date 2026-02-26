/**
 * IPD Flow Model
 * File: ipd-flow.model.js
 */

const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const sanitizeString = (value) => String(value || '').trim();
const normalizeObject = (value) =>
  value && typeof value === 'object' && !Array.isArray(value) ? { ...value } : null;
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
  if (typeof record === 'string' || typeof record === 'number') return toPublicId(record);

  return (
    toPublicId(record.human_friendly_id) ||
    toPublicId(record.display_id) ||
    toPublicId(record.admission_id) ||
    toPublicId(record.id) ||
    null
  );
};

const normalizeTimelineItem = (item) => {
  const row = normalizeObject(item);
  if (!row) return null;

  return {
    ...row,
    type: sanitizeString(row.type || row.event || 'ACTIVITY').toUpperCase(),
    at: sanitizeString(row.at || row.timestamp || row.created_at || row.round_at || row.administered_at),
    label: toDisplayText(row.label || row.title || row.note || row.notes || row.summary),
  };
};

const buildDerivedTimeline = (snapshot) => {
  const wardRounds = normalizeArray(snapshot?.ward_rounds).map((item) => ({
    type: 'WARD_ROUND',
    at: item?.round_at || item?.created_at,
    label: item?.notes || 'Ward round recorded',
  }));

  const nursingNotes = normalizeArray(snapshot?.nursing_notes).map((item) => ({
    type: 'NURSING_NOTE',
    at: item?.created_at,
    label: item?.note || 'Nursing note recorded',
  }));

  const medicationAdministrations = normalizeArray(snapshot?.medication_administrations).map((item) => ({
    type: 'MEDICATION_ADMINISTRATION',
    at: item?.administered_at || item?.created_at,
    label: item?.dose ? `Dose ${item.dose}${item.unit ? ` ${item.unit}` : ''}` : 'Medication administered',
  }));

  const transfers = normalizeArray(snapshot?.transfer_requests).map((item) => ({
    type: 'TRANSFER',
    at: item?.requested_at,
    label: item?.status ? `Transfer ${item.status}` : 'Transfer updated',
  }));

  return [...wardRounds, ...nursingNotes, ...medicationAdministrations, ...transfers]
    .map(normalizeTimelineItem)
    .filter((entry) => entry && entry.at)
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
  const flowSummary = normalizeObject(snapshot.flow_summary) || {};
  const activeBedAssignment = normalizeObject(snapshot.active_bed_assignment) || null;
  const openTransferRequest = normalizeObject(snapshot.open_transfer_request) || null;
  const latestDischargeSummary = normalizeObject(snapshot.latest_discharge_summary) || null;

  const admissionPublicId =
    toPublicId(snapshot.display_id) ||
    toPublicId(snapshot.human_friendly_id) ||
    toPublicId(snapshot.id) ||
    resolvePublicRecordId(admission) ||
    null;

  const patientPublicId =
    toPublicId(snapshot.patient_display_id) ||
    resolvePublicRecordId(patient) ||
    null;

  const bedPublicId =
    resolvePublicRecordId(activeBedAssignment?.bed) ||
    toPublicId(snapshot.bed_id) ||
    null;

  const patientDisplayName =
    toDisplayText(snapshot.patient_display_name) ||
    [toDisplayText(patient?.first_name), toDisplayText(patient?.last_name)].filter(Boolean).join(' ') ||
    patientPublicId ||
    'Unknown patient';

  const timelineSource = normalizeArray(snapshot.timeline).length > 0 ? snapshot.timeline : buildDerivedTimeline(snapshot);
  const timeline = timelineSource
    .map(normalizeTimelineItem)
    .filter(Boolean)
    .sort((left, right) => {
      const leftDate = new Date(left.at).getTime() || 0;
      const rightDate = new Date(right.at).getTime() || 0;
      return rightDate - leftDate;
    });

  return {
    ...snapshot,
    id: admissionPublicId,
    human_friendly_id: admissionPublicId,
    display_id: admissionPublicId,
    admission: {
      ...admission,
      id: admissionPublicId,
      human_friendly_id: admissionPublicId,
      tenant_id: null,
      facility_id: null,
      patient_id: patientPublicId,
      encounter_id: resolvePublicRecordId(encounter),
    },
    patient: patient
      ? {
          ...patient,
          id: patientPublicId,
          human_friendly_id: patientPublicId,
          tenant_id: null,
          facility_id: null,
        }
      : null,
    encounter: encounter
      ? {
          ...encounter,
          id: resolvePublicRecordId(encounter),
          human_friendly_id: resolvePublicRecordId(encounter),
          provider_user_id: toPublicId(encounter.provider_user_id),
        }
      : null,
    flow,
    flow_summary: flowSummary,
    stage: sanitizeString(snapshot.stage || flow.stage || flowSummary.stage).toUpperCase(),
    next_step: sanitizeString(snapshot.next_step || flow.next_step || flowSummary.next_step).toUpperCase() || null,
    transfer_status:
      sanitizeString(snapshot.transfer_status || flow.transfer_status || openTransferRequest?.status || flowSummary.transfer_status).toUpperCase() ||
      null,
    active_bed_assignment: activeBedAssignment,
    open_transfer_request: openTransferRequest,
    latest_discharge_summary: latestDischargeSummary,
    transfer_requests: normalizeArray(snapshot.transfer_requests),
    discharge_summaries: normalizeArray(snapshot.discharge_summaries),
    ward_rounds: normalizeArray(snapshot.ward_rounds),
    nursing_notes: normalizeArray(snapshot.nursing_notes),
    medication_administrations: normalizeArray(snapshot.medication_administrations),
    patient_display_name: patientDisplayName,
    patient_display_id: patientPublicId,
    ward_display_name:
      toDisplayText(snapshot.ward_display_name) ||
      toDisplayText(activeBedAssignment?.bed?.ward?.name) ||
      toDisplayText(openTransferRequest?.to_ward?.name) ||
      '',
    bed_display_label:
      toDisplayText(snapshot.bed_display_label) ||
      toDisplayText(activeBedAssignment?.bed?.label) ||
      '',
    bed_id: bedPublicId,
    has_active_bed:
      typeof snapshot.has_active_bed === 'boolean'
        ? snapshot.has_active_bed
        : typeof flowSummary.has_active_bed === 'boolean'
          ? flowSummary.has_active_bed
          : Boolean(activeBedAssignment),
    timeline,
  };
};

const normalizeIpdFlowListItem = (value) => {
  const normalized = normalizeIpdFlowSnapshot(value);
  if (!normalized) return null;
  return {
    ...normalized,
    admission_id: normalized.id,
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

const normalizeIpdLegacyResolution = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;
  return {
    admission_id: toPublicId(row.admission_id),
    resource: sanitizeString(row.resource).toLowerCase(),
    resource_id: toPublicId(row.resource_id),
    panel: toDisplayText(row.panel),
    action: toDisplayText(row.action),
    stage_hint: sanitizeString(row.stage_hint).toUpperCase() || null,
  };
};

export {
  normalizeIpdFlowSnapshot,
  normalizeIpdFlowList,
  normalizeIpdFlowListItem,
  normalizeIpdLegacyResolution,
};
