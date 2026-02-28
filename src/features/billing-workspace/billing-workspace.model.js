const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const sanitize = (value) => String(value || '').trim();
const normalizeObject = (value) =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? { ...value }
    : null;
const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const resolveDisplayIdentifier = (...candidates) => {
  for (const candidate of candidates) {
    const normalized = sanitize(candidate);
    if (!normalized) continue;
    if (UUID_LIKE_REGEX.test(normalized)) continue;
    return normalized;
  }
  return null;
};

const resolveBackendIdentifier = (...candidates) => {
  for (const candidate of candidates) {
    const normalized = sanitize(candidate);
    if (!normalized) continue;
    return normalized;
  }
  return null;
};

const normalizeTimelineItem = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;

  return {
    ...row,
    type: sanitize(row.type).toUpperCase() || 'UNKNOWN',
    action: sanitize(row.action).toUpperCase() || null,
    status: sanitize(row.status).toUpperCase() || null,
    display_id: resolveDisplayIdentifier(row.display_id, row.human_friendly_id, row.id),
    backend_identifier: resolveBackendIdentifier(row.display_id, row.human_friendly_id, row.id),
    invoice_display_id: resolveDisplayIdentifier(
      row.invoice_display_id,
      row.invoice_human_friendly_id
    ),
    invoice_backend_identifier: resolveBackendIdentifier(
      row.invoice_display_id,
      row.invoice_human_friendly_id,
      row.invoice_id
    ),
    payment_display_id: resolveDisplayIdentifier(
      row.payment_display_id,
      row.payment_human_friendly_id
    ),
    payment_backend_identifier: resolveBackendIdentifier(
      row.payment_display_id,
      row.payment_human_friendly_id,
      row.payment_id
    ),
    patient_display_id: resolveDisplayIdentifier(
      row.patient_display_id,
      row.patient_human_friendly_id
    ),
    patient_backend_identifier: resolveBackendIdentifier(
      row.patient_display_id,
      row.patient_human_friendly_id,
      row.patient_id
    ),
    patient_display_name: sanitize(row.patient_display_name) || null,
    timeline_at: sanitize(row.timeline_at) || null,
    amount: sanitize(row.amount) || null,
    currency: sanitize(row.currency) || null,
  };
};

const normalizeQueueMeta = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;
  return {
    queue: sanitize(row.queue).toUpperCase() || null,
    label: sanitize(row.label) || null,
    count: Number(row.count || 0),
  };
};

const normalizeQueueItem = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;

  const baseDisplayId = resolveDisplayIdentifier(
    row.display_id,
    row.human_friendly_id,
    row.id
  );
  const baseBackendId = resolveBackendIdentifier(
    row.display_id,
    row.human_friendly_id,
    row.id
  );

  return {
    ...row,
    display_id: baseDisplayId,
    backend_identifier: baseBackendId,
    invoice_display_id: resolveDisplayIdentifier(
      row.invoice_display_id,
      row.invoice_human_friendly_id,
      row.invoice_id
    ),
    invoice_backend_identifier: resolveBackendIdentifier(
      row.invoice_display_id,
      row.invoice_human_friendly_id,
      row.invoice_id
    ),
    payment_display_id: resolveDisplayIdentifier(
      row.payment_display_id,
      row.payment_human_friendly_id,
      row.payment_id
    ),
    payment_backend_identifier: resolveBackendIdentifier(
      row.payment_display_id,
      row.payment_human_friendly_id,
      row.payment_id
    ),
    patient_display_id: resolveDisplayIdentifier(
      row.patient_display_id,
      row.patient_human_friendly_id,
      row.patient_id
    ),
    patient_backend_identifier: resolveBackendIdentifier(
      row.patient_display_id,
      row.patient_human_friendly_id,
      row.patient_id
    ),
    approval_display_id: resolveDisplayIdentifier(
      row.approval_display_id,
      row.target_display_id,
      row.display_id,
      row.id
    ),
    approval_backend_identifier: resolveBackendIdentifier(
      row.approval_display_id,
      row.display_id,
      row.id
    ),
    patient_display_name: sanitize(row.patient_display_name) || null,
    status: sanitize(row.status).toUpperCase() || null,
    billing_status: sanitize(row.billing_status).toUpperCase() || null,
    timeline_at: sanitize(row.timeline_at) || null,
    amount:
      sanitize(row.amount) ||
      sanitize(row.total_amount) ||
      sanitize(row.balance_due) ||
      null,
    currency: sanitize(row.currency) || null,
  };
};

const normalizeWorkspacePayload = (value) => {
  const payload = normalizeObject(value) || {};
  const summary = normalizeObject(payload.summary) || {};
  const queueMeta = normalizeArray(payload.queues).map(normalizeQueueMeta).filter(Boolean);
  const timeline = normalizeObject(payload.timeline) || {};
  const timelineItems = normalizeArray(timeline.items)
    .map(normalizeTimelineItem)
    .filter(Boolean);

  return {
    summary: {
      needs_issue: Number(summary.needs_issue || 0),
      pending_payment: Number(summary.pending_payment || 0),
      claims_pending: Number(summary.claims_pending || 0),
      approval_required: Number(summary.approval_required || 0),
      overdue: Number(summary.overdue || 0),
      payments_today_total: sanitize(summary.payments_today_total) || '0.00',
      refunds_today_total: sanitize(summary.refunds_today_total) || '0.00',
    },
    queues: queueMeta,
    timeline: {
      groups: normalizeArray(timeline.groups).map((group) => {
        const normalizedGroup = normalizeObject(group) || {};
        return {
          bucket: sanitize(normalizedGroup.bucket).toUpperCase() || 'EARLIER',
          label: sanitize(normalizedGroup.label) || 'Earlier',
          items: normalizeArray(normalizedGroup.items)
            .map(normalizeTimelineItem)
            .filter(Boolean),
        };
      }),
      items: timelineItems,
      pagination: normalizeObject(timeline.pagination) || null,
    },
    generated_at: sanitize(payload.generated_at) || null,
  };
};

const normalizeWorkItemsPayload = (value) => {
  const payload = normalizeObject(value) || {};
  const queue = sanitize(payload.queue).toUpperCase();

  if (queue) {
    return {
      queue,
      items: normalizeArray(payload.items).map(normalizeQueueItem).filter(Boolean),
      pagination: normalizeObject(payload.pagination) || null,
    };
  }

  return {
    queues: normalizeArray(payload.queues).map((entry) => {
      const normalized = normalizeObject(entry) || {};
      return {
        queue: sanitize(normalized.queue).toUpperCase() || null,
        total: Number(normalized.total || 0),
        items: normalizeArray(normalized.items).map(normalizeQueueItem).filter(Boolean),
      };
    }),
  };
};

const normalizeLedgerPayload = (value) => {
  const payload = normalizeObject(value) || {};
  const patient = normalizeObject(payload.patient) || {};
  const summary = normalizeObject(payload.summary) || {};
  const ledger = normalizeObject(payload.ledger) || {};

  return {
    patient: {
      display_id: resolveDisplayIdentifier(patient.display_id, patient.human_friendly_id),
      backend_identifier: resolveBackendIdentifier(
        patient.display_id,
        patient.human_friendly_id,
        patient.id
      ),
      display_name: sanitize(patient.display_name) || null,
    },
    summary: {
      total_invoiced: sanitize(summary.total_invoiced) || '0.00',
      total_adjustments: sanitize(summary.total_adjustments) || '0.00',
      total_paid: sanitize(summary.total_paid) || '0.00',
      total_refunded: sanitize(summary.total_refunded) || '0.00',
      net_paid: sanitize(summary.net_paid) || '0.00',
      balance_due: sanitize(summary.balance_due) || '0.00',
    },
    ledger: {
      groups: normalizeArray(ledger.groups).map((group) => {
        const normalizedGroup = normalizeObject(group) || {};
        return {
          bucket: sanitize(normalizedGroup.bucket).toUpperCase() || 'EARLIER',
          label: sanitize(normalizedGroup.label) || 'Earlier',
          items: normalizeArray(normalizedGroup.items)
            .map(normalizeTimelineItem)
            .filter(Boolean),
        };
      }),
      items: normalizeArray(ledger.items).map(normalizeTimelineItem).filter(Boolean),
      pagination: normalizeObject(ledger.pagination) || null,
    },
  };
};

const resolveDisplayIdText = (...candidates) =>
  resolveDisplayIdentifier(...candidates) || null;

export {
  normalizeWorkspacePayload,
  normalizeWorkItemsPayload,
  normalizeLedgerPayload,
  resolveDisplayIdText,
};
