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

const normalizeInventoryItem = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;

  const id = resolvePublicId(row.display_id, row.human_friendly_id, row.id);
  return {
    ...row,
    id,
    display_id: id,
    tenant_id: resolvePublicId(row.tenant_display_id, row.tenant_id),
    name: sanitizeString(row.name) || '',
    category: sanitizeString(row.category).toUpperCase() || null,
    sku: sanitizeString(row.sku) || '',
    unit: sanitizeString(row.unit) || '',
  };
};

const normalizeInventoryStock = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;

  const id = resolvePublicId(row.display_id, row.human_friendly_id, row.id);
  const inventoryItem = normalizeInventoryItem(row.inventory_item);

  return {
    ...row,
    id,
    display_id: id,
    inventory_item_id: resolvePublicId(
      inventoryItem?.id,
      row.inventory_item_display_id,
      row.inventory_item_id
    ),
    inventory_item: inventoryItem,
    facility_id: resolvePublicId(row.facility_display_id, row.facility_id),
    facility_name: sanitizeString(row.facility_name) || '',
    quantity: toNumber(row.quantity),
    reorder_level: toNumber(row.reorder_level),
    low_stock: Boolean(row.low_stock),
  };
};

const normalizeDispenseLog = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;

  const id = resolvePublicId(row.display_id, row.human_friendly_id, row.id);
  return {
    ...row,
    id,
    display_id: id,
    pharmacy_order_item_id: resolvePublicId(
      row.pharmacy_order_item_display_id,
      row.pharmacy_order_item_id
    ),
    dispense_batch_ref: sanitizeString(row.dispense_batch_ref) || null,
    status: sanitizeString(row.status).toUpperCase() || null,
    quantity_dispensed: toNumber(row.quantity_dispensed),
  };
};

const normalizeStockMapping = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;

  const id = resolvePublicId(row.display_id, row.human_friendly_id, row.id);
  return {
    ...row,
    id,
    display_id: id,
    drug_id: resolvePublicId(row.drug_display_id, row.drug_id),
    inventory_item_id: resolvePublicId(row.inventory_item_display_id, row.inventory_item_id),
    is_default: Boolean(row.is_default),
    deduction_factor: toNumber(row.deduction_factor) || 1,
    inventory_item: normalizeInventoryItem(row.inventory_item),
  };
};

const normalizeOrderItem = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;

  const id = resolvePublicId(row.display_id, row.human_friendly_id, row.id);
  const stockMappings = normalizeArray(row.stock_mappings)
    .map(normalizeStockMapping)
    .filter(Boolean);

  return {
    ...row,
    id,
    display_id: id,
    pharmacy_order_id: resolvePublicId(row.pharmacy_order_display_id, row.pharmacy_order_id),
    drug_id: resolvePublicId(row.drug_display_id, row.drug_id),
    drug_display_name: sanitizeString(row.drug_display_name) || '',
    drug_code: sanitizeString(row.drug_code) || '',
    dosage: sanitizeString(row.dosage) || '',
    frequency: sanitizeString(row.frequency).toUpperCase() || null,
    route: sanitizeString(row.route).toUpperCase() || null,
    status: sanitizeString(row.status).toUpperCase() || null,
    quantity_prescribed: toNumber(row.quantity_prescribed),
    quantity_dispensed: toNumber(row.quantity_dispensed),
    quantity_pending: toNumber(row.quantity_pending),
    quantity_returned: toNumber(row.quantity_returned),
    quantity_remaining: toNumber(row.quantity_remaining),
    dispense_logs: normalizeArray(row.dispense_logs).map(normalizeDispenseLog).filter(Boolean),
    stock_mappings: stockMappings,
    default_stock_mapping:
      normalizeStockMapping(row.default_stock_mapping) ||
      stockMappings.find((entry) => entry.is_default) ||
      stockMappings[0] ||
      null,
  };
};

const normalizeAttestation = (value) => {
  const row = normalizeObject(value);
  if (!row) return null;

  const id = resolvePublicId(row.display_id, row.human_friendly_id, row.id);
  return {
    ...row,
    id,
    display_id: id,
    pharmacy_order_id: resolvePublicId(row.pharmacy_order_display_id, row.pharmacy_order_id),
    dispense_batch_ref: sanitizeString(row.dispense_batch_ref) || null,
    phase: sanitizeString(row.phase).toUpperCase() || null,
    attested_by_user_id: resolvePublicId(row.attested_by_user_id),
    attested_role: sanitizeString(row.attested_role) || null,
    statement: sanitizeString(row.statement) || null,
    reason: sanitizeString(row.reason) || null,
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
    patient_display_name: sanitizeString(row.patient_display_name) || '',
    status: sanitizeString(row.status).toUpperCase() || null,
    item_count: toNumber(row.item_count),
    quantity_prescribed_total: toNumber(row.quantity_prescribed_total),
    quantity_dispensed_total: toNumber(row.quantity_dispensed_total),
    quantity_pending_total: toNumber(row.quantity_pending_total),
    quantity_returned_total: toNumber(row.quantity_returned_total),
    quantity_remaining_total: toNumber(row.quantity_remaining_total),
    pending_attestation_batch_count: toNumber(row.pending_attestation_batch_count),
    pending_attestation_batches: normalizeArray(row.pending_attestation_batches),
    items: normalizeArray(row.items).map(normalizeOrderItem).filter(Boolean),
    dispense_attestations: normalizeArray(row.dispense_attestations)
      .map(normalizeAttestation)
      .filter(Boolean),
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

const normalizePharmacyWorkbenchPayload = (value) => {
  const payload = normalizeObject(value) || {};
  const summary = normalizeObject(payload.summary) || {};

  return {
    summary: {
      total_orders: toNumber(summary.total_orders),
      ordered_queue: toNumber(summary.ordered_queue),
      partially_dispensed_queue: toNumber(summary.partially_dispensed_queue),
      dispensed_orders: toNumber(summary.dispensed_orders),
      cancelled_orders: toNumber(summary.cancelled_orders),
      pending_attestations: toNumber(summary.pending_attestations),
    },
    worklist: normalizeArray(payload.worklist)
      .map(normalizeWorkbenchOrder)
      .filter(Boolean),
    pagination: normalizeObject(payload.pagination),
  };
};

const normalizePharmacyWorkflowPayload = (value) => {
  const payload = normalizeObject(value) || {};
  const order = normalizeWorkbenchOrder(payload.order);
  const items = normalizeArray(payload.items).map(normalizeOrderItem).filter(Boolean);
  const attestations = normalizeArray(payload.attestations)
    .map(normalizeAttestation)
    .filter(Boolean);
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
    items,
    attestations,
    timeline,
    next_actions: {
      can_prepare_dispense: Boolean(nextActions.can_prepare_dispense),
      can_attest_dispense: Boolean(nextActions.can_attest_dispense),
      can_cancel: Boolean(nextActions.can_cancel),
      can_return: Boolean(nextActions.can_return),
      can_adjust_inventory: Boolean(nextActions.can_adjust_inventory),
    },
  };
};

const normalizeInventoryStockPayload = (value) => {
  const payload = normalizeObject(value) || {};
  const summary = normalizeObject(payload.summary) || {};

  return {
    summary: {
      total_stock_rows: toNumber(summary.total_stock_rows),
      low_stock_rows: toNumber(summary.low_stock_rows),
    },
    stocks: normalizeArray(payload.stocks).map(normalizeInventoryStock).filter(Boolean),
    pagination: normalizeObject(payload.pagination),
  };
};

const normalizePharmacyLegacyResolution = (value) => {
  const payload = normalizeObject(value);
  if (!payload) return null;

  const identifier = resolvePublicId(payload.identifier, payload.id);
  return {
    id: identifier,
    identifier,
    resource: sanitizeString(payload.resource).toLowerCase(),
    route: sanitizeString(payload.route) || '/pharmacy',
    matched_by: sanitizeString(payload.matched_by).toLowerCase() || null,
  };
};

export {
  normalizePharmacyWorkbenchPayload,
  normalizePharmacyWorkflowPayload,
  normalizeInventoryStockPayload,
  normalizePharmacyLegacyResolution,
};
