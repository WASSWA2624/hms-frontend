/**
 * OPD Flow Model
 * File: opd-flow.model.js
 */
const sanitizeString = (value) => String(value || '').trim();

const normalizeObject = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return { ...value };
};

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const normalizeTimelineItem = (value) => {
  const item = normalizeObject(value);
  if (!item) return null;
  return {
    ...item,
    event: sanitizeString(item.event),
    at: sanitizeString(item.at),
    by_user_id: item.by_user_id || null,
    details: normalizeObject(item.details) || {},
  };
};

const normalizeTimeline = (value) =>
  normalizeArray(value).map(normalizeTimelineItem).filter(Boolean);

const resolveRawFlow = (value) => {
  const directFlow = normalizeObject(value?.flow);
  if (directFlow) return directFlow;
  const encounterFlow = normalizeObject(value?.encounter?.extension_json?.opd_flow);
  if (encounterFlow) return encounterFlow;
  return {};
};

const resolveRecordId = (value) => {
  if (!value) return null;
  if (typeof value === 'string' || typeof value === 'number') return value;
  return value.id || null;
};

const resolveRecordHumanFriendlyId = (value) => {
  if (!value || typeof value !== 'object') return null;
  return value.human_friendly_id || value.humanFriendlyId || null;
};

const resolveRecordDisplayId = (value) =>
  resolveRecordHumanFriendlyId(value) || resolveRecordId(value);

const resolveFirstHumanFriendlyId = (value) =>
  normalizeArray(value)
    .map(resolveRecordHumanFriendlyId)
    .filter(Boolean)[0] || null;

const resolveHumanFriendlyIds = (value) =>
  normalizeArray(value).map(resolveRecordHumanFriendlyId).filter(Boolean);

const normalizeFlowMetadata = (value) => {
  const flow = normalizeObject(value) || {};
  return {
    ...flow,
    stage: sanitizeString(flow.stage),
    next_step: sanitizeString(flow.next_step) || null,
    arrival_mode: sanitizeString(flow.arrival_mode) || null,
    timeline: normalizeTimeline(flow.timeline),
    lab_order_ids: normalizeArray(flow.lab_order_ids).filter(Boolean),
    radiology_order_ids: normalizeArray(flow.radiology_order_ids).filter(Boolean),
  };
};

const normalizeOpdFlowSnapshot = (value) => {
  const snapshot = normalizeObject(value);
  if (!snapshot) return null;

  const encounter = normalizeObject(snapshot.encounter);
  const flow = normalizeFlowMetadata(resolveRawFlow(snapshot));
  const consultation = normalizeObject(flow.consultation) || {};
  const encounterLabOrders = normalizeArray(encounter?.lab_orders);
  const encounterRadiologyOrders = normalizeArray(encounter?.radiology_orders);
  const encounterPharmacyOrders = normalizeArray(encounter?.pharmacy_orders);
  const encounterAdmissions = normalizeArray(encounter?.admissions);
  const labOrderHumanFriendlyIds = resolveHumanFriendlyIds(encounterLabOrders);
  const radiologyOrderHumanFriendlyIds = resolveHumanFriendlyIds(encounterRadiologyOrders);

  return {
    ...snapshot,
    encounter,
    flow,
    timeline: flow.timeline,
    linked_record_ids: {
      encounter_id: resolveRecordHumanFriendlyId(encounter),
      visit_queue_id: resolveRecordHumanFriendlyId(snapshot.visit_queue),
      appointment_id: resolveRecordHumanFriendlyId(snapshot.appointment),
      consultation_invoice_id:
        resolveRecordHumanFriendlyId(snapshot.consultation_invoice) ||
        sanitizeString(consultation.invoice_human_friendly_id) ||
        null,
      consultation_payment_id:
        resolveRecordHumanFriendlyId(snapshot.consultation_payment) ||
        sanitizeString(consultation.payment_human_friendly_id) ||
        null,
      emergency_case_id: resolveRecordHumanFriendlyId(snapshot.emergency_case),
      triage_assessment_id:
        resolveRecordHumanFriendlyId(snapshot.triage_assessment),
      lab_order_ids:
        labOrderHumanFriendlyIds.length > 0
          ? labOrderHumanFriendlyIds
          : normalizeArray(flow.lab_order_human_friendly_ids).filter(Boolean),
      radiology_order_ids:
        radiologyOrderHumanFriendlyIds.length > 0
          ? radiologyOrderHumanFriendlyIds
          : normalizeArray(flow.radiology_order_human_friendly_ids).filter(Boolean),
      pharmacy_order_id:
        resolveFirstHumanFriendlyId(encounterPharmacyOrders) ||
        sanitizeString(flow.pharmacy_order_human_friendly_id) ||
        null,
      admission_id:
        resolveFirstHumanFriendlyId(encounterAdmissions) ||
        sanitizeString(flow.admission_human_friendly_id) ||
        null,
    },
  };
};

const normalizeOpdFlowListItem = (value) => {
  const item = normalizeObject(value);
  if (!item) return null;
  const snapshot = normalizeOpdFlowSnapshot(item);
  if (!snapshot) return null;
  const encounter = snapshot.encounter || {};
  const flow = snapshot.flow || {};
  return {
    ...snapshot,
    id: resolveRecordId(encounter) || flow.encounter_id || null,
    human_friendly_id: resolveRecordHumanFriendlyId(encounter) || null,
    stage: flow.stage || '',
    next_step: flow.next_step || null,
    patient_id: encounter.patient_id || null,
    patient_human_friendly_id: resolveRecordHumanFriendlyId(encounter?.patient) || null,
    provider_user_id: encounter.provider_user_id || null,
    encounter_type: encounter.encounter_type || null,
    started_at: encounter.started_at || null,
  };
};

const normalizeOpdFlowList = (value) => {
  if (Array.isArray(value)) {
    return {
      items: value.map(normalizeOpdFlowListItem).filter(Boolean),
      pagination: null,
    };
  }

  if (value && typeof value === 'object') {
    const items = normalizeArray(value.items).map(normalizeOpdFlowListItem).filter(Boolean);
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

const normalizeOpdLegacyResolution = (value) => {
  const resolution = normalizeObject(value);
  if (!resolution) return null;
  return { ...resolution };
};

export {
  normalizeFlowMetadata,
  normalizeOpdFlowSnapshot,
  normalizeOpdFlowList,
  normalizeOpdLegacyResolution,
};
