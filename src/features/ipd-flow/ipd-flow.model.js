/**
 * IPD Flow Model
 * File: ipd-flow.model.js
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
const toUpperToken = (value) => {
  const normalized = toDisplayText(value);
  return normalized ? normalized.toUpperCase() : '';
};

const resolvePublicRecordId = (record) => {
  if (!record) return null;
  if (typeof record === 'string' || typeof record === 'number')
    return toPublicId(record);

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
    at: sanitizeString(
      row.at ||
        row.timestamp ||
        row.created_at ||
        row.round_at ||
        row.administered_at
    ),
    label: toDisplayText(
      row.label || row.title || row.note || row.notes || row.summary
    ),
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

  const medicationAdministrations = normalizeArray(
    snapshot?.medication_administrations
  ).map((item) => ({
    type: 'MEDICATION_ADMINISTRATION',
    at: item?.administered_at || item?.created_at,
    label: item?.dose
      ? `Dose ${item.dose}${item.unit ? ` ${item.unit}` : ''}`
      : 'Medication administered',
  }));

  const transfers = normalizeArray(snapshot?.transfer_requests).map((item) => ({
    type: 'TRANSFER',
    at: item?.requested_at,
    label: item?.status ? `Transfer ${item.status}` : 'Transfer updated',
  }));

  const icuObservations = normalizeArray(
    snapshot?.icu?.recent_observations
  ).map((item) => ({
    type: 'ICU_OBSERVATION',
    at: item?.observed_at || item?.created_at,
    label: item?.observation || 'ICU observation recorded',
  }));

  const criticalAlerts = normalizeArray(snapshot?.icu?.recent_alerts).map(
    (item) => ({
      type: 'CRITICAL_ALERT',
      at: item?.created_at,
      label: item?.severity
        ? `${item.severity}: ${item.message || 'Critical alert raised'}`
        : item?.message || 'Critical alert raised',
    })
  );

  return [
    ...wardRounds,
    ...nursingNotes,
    ...medicationAdministrations,
    ...transfers,
    ...icuObservations,
    ...criticalAlerts,
  ]
    .map(normalizeTimelineItem)
    .filter((entry) => entry && entry.at)
    .sort((left, right) => {
      const leftDate = new Date(left.at).getTime() || 0;
      const rightDate = new Date(right.at).getTime() || 0;
      return rightDate - leftDate;
    });
};

const normalizeIcuStay = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;

  const stayId = resolvePublicRecordId(row);
  const admissionId =
    toPublicId(row.admission_display_id) ||
    toPublicId(row.admission_id) ||
    null;
  const patientId =
    toPublicId(row.patient_display_id) || toPublicId(row.patient_id) || null;

  return {
    ...row,
    id: stayId,
    display_id: stayId,
    human_friendly_id: stayId,
    admission_id: admissionId,
    patient_display_id: patientId,
    patient_display_name: toDisplayText(row.patient_display_name),
  };
};

const normalizeIcuObservation = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;

  return {
    ...row,
    id: resolvePublicRecordId(row),
    display_id: resolvePublicRecordId(row),
    icu_stay_id:
      toPublicId(row.icu_stay_display_id) ||
      toPublicId(row.icu_stay_id) ||
      null,
    admission_id:
      toPublicId(row.admission_display_id) ||
      toPublicId(row.admission_id) ||
      null,
    patient_display_id: toPublicId(row.patient_display_id) || null,
    patient_display_name: toDisplayText(row.patient_display_name),
  };
};

const normalizeCriticalAlert = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;

  return {
    ...row,
    id: resolvePublicRecordId(row),
    display_id: resolvePublicRecordId(row),
    icu_stay_id:
      toPublicId(row.icu_stay_display_id) ||
      toPublicId(row.icu_stay_id) ||
      null,
    admission_id:
      toPublicId(row.admission_display_id) ||
      toPublicId(row.admission_id) ||
      null,
    patient_display_id: toPublicId(row.patient_display_id) || null,
    patient_display_name: toDisplayText(row.patient_display_name),
    severity: toUpperToken(row.severity) || null,
    message: toDisplayText(row.message),
  };
};

const normalizeIcuAlertSummary = (value) => {
  const summary = normalizeObject(value);
  if (!summary) {
    return {
      total: 0,
      highest_severity: null,
      by_severity: { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 },
      recent: [],
    };
  }

  const recent = normalizeArray(summary.recent)
    .map(normalizeCriticalAlert)
    .filter(Boolean);

  return {
    ...summary,
    total: Number(summary.total || 0),
    highest_severity: toUpperToken(summary.highest_severity) || null,
    by_severity: {
      LOW: Number(summary?.by_severity?.LOW || 0),
      MEDIUM: Number(summary?.by_severity?.MEDIUM || 0),
      HIGH: Number(summary?.by_severity?.HIGH || 0),
      CRITICAL: Number(summary?.by_severity?.CRITICAL || 0),
    },
    recent,
  };
};

const normalizeIcuOverlay = (value) => {
  const overlay = normalizeObject(value);
  if (!overlay) return null;

  const activeStay = normalizeIcuStay(overlay.active_stay);
  const latestStay = normalizeIcuStay(overlay.latest_stay);
  const recentStays = normalizeArray(overlay.recent_stays)
    .map(normalizeIcuStay)
    .filter(Boolean);
  const recentObservations = normalizeArray(overlay.recent_observations)
    .map(normalizeIcuObservation)
    .filter(Boolean);
  const recentAlerts = normalizeArray(overlay.recent_alerts)
    .map(normalizeCriticalAlert)
    .filter(Boolean);
  const criticalAlertSummary = normalizeIcuAlertSummary(
    overlay.critical_alert_summary
  );
  const criticalSeverity =
    toUpperToken(overlay.critical_severity) ||
    criticalAlertSummary.highest_severity ||
    null;

  return {
    ...overlay,
    status: toUpperToken(overlay.status) || null,
    has_critical_alert:
      typeof overlay.has_critical_alert === 'boolean'
        ? overlay.has_critical_alert
        : Boolean(criticalAlertSummary.total || recentAlerts.length),
    critical_severity: criticalSeverity,
    active_stay: activeStay,
    latest_stay: latestStay,
    recent_stays: recentStays,
    recent_observations: recentObservations,
    recent_alerts: recentAlerts,
    critical_alert_summary: criticalAlertSummary,
  };
};

const normalizeIpdFlowSnapshot = (value) => {
  const snapshot = normalizeObject(value);
  if (!snapshot) return null;

  const admission = normalizeObject(snapshot.admission) || {};
  const patient = normalizeObject(snapshot.patient) || null;
  const encounter = normalizeObject(snapshot.encounter) || null;
  const flow = normalizeObject(snapshot.flow) || {};
  const flowSummary = normalizeObject(snapshot.flow_summary) || {};
  const activeBedAssignment =
    normalizeObject(snapshot.active_bed_assignment) || null;
  const openTransferRequest =
    normalizeObject(snapshot.open_transfer_request) || null;
  const latestDischargeSummary =
    normalizeObject(snapshot.latest_discharge_summary) || null;
  const icuOverlay = normalizeIcuOverlay(snapshot.icu);

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
    [toDisplayText(patient?.first_name), toDisplayText(patient?.last_name)]
      .filter(Boolean)
      .join(' ') ||
    patientPublicId ||
    'Unknown patient';

  const timelineSource =
    normalizeArray(snapshot.timeline).length > 0
      ? snapshot.timeline
      : buildDerivedTimeline({ ...snapshot, icu: icuOverlay });
  const timeline = timelineSource
    .map(normalizeTimelineItem)
    .filter(Boolean)
    .sort((left, right) => {
      const leftDate = new Date(left.at).getTime() || 0;
      const rightDate = new Date(right.at).getTime() || 0;
      return rightDate - leftDate;
    });

  const icuStatus =
    toUpperToken(snapshot.icu_status) ||
    toUpperToken(icuOverlay?.status) ||
    null;
  const hasCriticalAlert =
    typeof snapshot.has_critical_alert === 'boolean'
      ? snapshot.has_critical_alert
      : Boolean(icuOverlay?.has_critical_alert);
  const criticalSeverity =
    toUpperToken(snapshot.critical_severity) ||
    toUpperToken(icuOverlay?.critical_severity) ||
    null;
  const activeIcuStayId =
    toPublicId(snapshot.active_icu_stay_id) ||
    toPublicId(icuOverlay?.active_stay?.id) ||
    null;
  const latestIcuStayId =
    toPublicId(snapshot.latest_icu_stay_id) ||
    toPublicId(icuOverlay?.latest_stay?.id) ||
    null;

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
    stage: sanitizeString(
      snapshot.stage || flow.stage || flowSummary.stage
    ).toUpperCase(),
    next_step:
      sanitizeString(
        snapshot.next_step || flow.next_step || flowSummary.next_step
      ).toUpperCase() || null,
    transfer_status:
      sanitizeString(
        snapshot.transfer_status ||
          flow.transfer_status ||
          openTransferRequest?.status ||
          flowSummary.transfer_status
      ).toUpperCase() || null,
    active_bed_assignment: activeBedAssignment,
    open_transfer_request: openTransferRequest,
    latest_discharge_summary: latestDischargeSummary,
    transfer_requests: normalizeArray(snapshot.transfer_requests),
    discharge_summaries: normalizeArray(snapshot.discharge_summaries),
    ward_rounds: normalizeArray(snapshot.ward_rounds),
    nursing_notes: normalizeArray(snapshot.nursing_notes),
    medication_administrations: normalizeArray(
      snapshot.medication_administrations
    ),
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
    icu: icuOverlay,
    icu_status: icuStatus,
    has_critical_alert: hasCriticalAlert,
    critical_severity: criticalSeverity,
    active_icu_stay_id: activeIcuStayId,
    latest_icu_stay_id: latestIcuStayId,
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
    const items = normalizeArray(value.items)
      .map(normalizeIpdFlowListItem)
      .filter(Boolean);
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
