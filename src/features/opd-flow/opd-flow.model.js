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

  return {
    ...snapshot,
    encounter,
    flow,
    timeline: flow.timeline,
    linked_record_ids: {
      encounter_id: resolveRecordId(encounter),
      visit_queue_id: flow.visit_queue_id || resolveRecordId(snapshot.visit_queue),
      appointment_id: flow.appointment_id || resolveRecordId(snapshot.appointment),
      consultation_invoice_id:
        consultation.invoice_id || resolveRecordId(snapshot.consultation_invoice),
      consultation_payment_id:
        consultation.payment_id || resolveRecordId(snapshot.consultation_payment),
      emergency_case_id: flow.emergency_case_id || resolveRecordId(snapshot.emergency_case),
      triage_assessment_id:
        flow.triage_assessment_id || resolveRecordId(snapshot.triage_assessment),
      lab_order_ids:
        flow.lab_order_ids.length > 0
          ? flow.lab_order_ids
          : normalizeArray(snapshot.encounter?.lab_orders).map((item) => item?.id).filter(Boolean),
      radiology_order_ids:
        flow.radiology_order_ids.length > 0
          ? flow.radiology_order_ids
          : normalizeArray(snapshot.encounter?.radiology_orders)
              .map((item) => item?.id)
              .filter(Boolean),
      pharmacy_order_id:
        flow.pharmacy_order_id
        || normalizeArray(snapshot.encounter?.pharmacy_orders)[0]?.id
        || null,
      admission_id:
        flow.admission_id || normalizeArray(snapshot.encounter?.admissions)[0]?.id || null,
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
    stage: flow.stage || '',
    next_step: flow.next_step || null,
    patient_id: encounter.patient_id || null,
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

export { normalizeFlowMetadata, normalizeOpdFlowSnapshot, normalizeOpdFlowList };
