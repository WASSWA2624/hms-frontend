import { z } from 'zod';

const FRIENDLY_ID_REGEX = /^[A-Za-z][A-Za-z0-9_-]*$/;
const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const LEGACY_RESOURCE_VALUES = [
  'pharmacy-orders',
  'pharmacy-order-items',
  'dispense-logs',
  'inventory-items',
  'inventory-stocks',
  'stock-movements',
  'drugs',
];

const identifierSchema = z
  .string()
  .trim()
  .min(2)
  .max(64)
  .refine(
    (value) => UUID_LIKE_REGEX.test(value) || FRIENDLY_ID_REGEX.test(value),
    'Invalid identifier format'
  );

const optionalIdentifierSchema = identifierSchema.optional().nullable();
const isoDateTimeSchema = z.string().datetime();

const normalizeRouteStateValue = (value) => {
  const normalized = Array.isArray(value)
    ? String(value[0] || '').trim()
    : String(value || '').trim();
  return normalized || undefined;
};

const panelSchema = z.enum(['orders', 'inventory']);

const listParamsSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  sort_by: z.enum(['ordered_at', 'updated_at', 'status']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  panel: panelSchema.optional(),
  status: z.enum(['ORDERED', 'PARTIALLY_DISPENSED', 'DISPENSED', 'CANCELLED']).optional(),
  from: z.string().trim().optional(),
  to: z.string().trim().optional(),
  patient_id: identifierSchema.optional(),
  encounter_id: optionalIdentifierSchema,
  search: z.string().trim().optional(),
});

const inventoryListParamsSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  sort_by: z.enum(['updated_at', 'created_at', 'quantity']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  facility_id: optionalIdentifierSchema,
  inventory_item_id: optionalIdentifierSchema,
  low_stock_only: z.coerce.boolean().optional(),
  search: z.string().trim().optional(),
});

const resolveLegacyResourceSchema = z.enum(LEGACY_RESOURCE_VALUES);
const resolveLegacyRouteParamsSchema = z.object({
  resource: resolveLegacyResourceSchema,
  id: identifierSchema,
});

const workbenchRouteStateSchema = z.object({
  id: identifierSchema.optional(),
  panel: panelSchema.optional(),
  action: z.string().trim().min(1).max(64).optional(),
  resource: resolveLegacyResourceSchema.optional(),
  legacyId: identifierSchema.optional(),
  patientId: identifierSchema.optional(),
  encounterId: identifierSchema.optional(),
  inventoryItemId: identifierSchema.optional(),
  facilityId: identifierSchema.optional(),
});

const prepareDispenseLineSchema = z.object({
  order_item_id: identifierSchema,
  quantity: z.coerce.number().int().positive(),
  inventory_item_id: optionalIdentifierSchema,
  notes: z.string().trim().max(255).optional().nullable(),
});

const prepareDispensePayloadSchema = z.object({
  dispense_batch_ref: z.string().trim().min(3).max(64).optional(),
  facility_id: optionalIdentifierSchema,
  statement: z.string().trim().max(65535).optional().nullable(),
  reason: z.string().trim().max(255).optional().nullable(),
  items: z.array(prepareDispenseLineSchema).min(1).optional(),
});

const attestDispensePayloadSchema = z.object({
  dispense_batch_ref: z.string().trim().min(3).max(64),
  facility_id: optionalIdentifierSchema,
  statement: z.string().trim().max(65535).optional().nullable(),
  reason: z.string().trim().max(255).optional().nullable(),
  attested_at: isoDateTimeSchema.optional(),
});

const cancelOrderPayloadSchema = z.object({
  reason: z.string().trim().min(2).max(255),
  notes: z.string().trim().max(65535).optional().nullable(),
});

const returnDispenseLineSchema = z.object({
  order_item_id: identifierSchema,
  quantity: z.coerce.number().int().positive(),
  inventory_item_id: optionalIdentifierSchema,
});

const returnOrderPayloadSchema = z.object({
  facility_id: optionalIdentifierSchema,
  reason: z.string().trim().min(2).max(255).optional().nullable(),
  notes: z.string().trim().max(65535).optional().nullable(),
  items: z.array(returnDispenseLineSchema).min(1),
});

const adjustInventoryPayloadSchema = z.object({
  inventory_item_id: identifierSchema,
  facility_id: optionalIdentifierSchema,
  quantity_delta: z.coerce.number().int().refine((value) => value !== 0, {
    message: 'quantity_delta cannot be zero',
  }),
  reason: z.enum(['PURCHASE', 'DISPENSE', 'RETURN', 'DAMAGE', 'EXPIRY', 'OTHER']).optional(),
  notes: z.string().trim().max(255).optional().nullable(),
  occurred_at: isoDateTimeSchema.optional(),
});

const parsePharmacyWorkspaceId = (value) => identifierSchema.parse(value);
const parsePharmacyWorkbenchListParams = (value) => listParamsSchema.parse(value ?? {});
const parseInventoryStockListParams = (value) => inventoryListParamsSchema.parse(value ?? {});
const parseResolvePharmacyLegacyRouteParams = (value) =>
  resolveLegacyRouteParamsSchema.parse(value ?? {});
const parsePharmacyWorkbenchRouteState = (value) =>
  workbenchRouteStateSchema.parse({
    id: normalizeRouteStateValue(value?.id),
    panel: normalizeRouteStateValue(value?.panel),
    action: normalizeRouteStateValue(value?.action),
    resource: normalizeRouteStateValue(value?.resource),
    legacyId: normalizeRouteStateValue(value?.legacyId),
    patientId: normalizeRouteStateValue(value?.patientId),
    encounterId: normalizeRouteStateValue(value?.encounterId),
    inventoryItemId: normalizeRouteStateValue(value?.inventoryItemId),
    facilityId: normalizeRouteStateValue(value?.facilityId),
  });
const parsePrepareDispensePayload = (value) => prepareDispensePayloadSchema.parse(value ?? {});
const parseAttestDispensePayload = (value) => attestDispensePayloadSchema.parse(value ?? {});
const parseCancelOrderPayload = (value) => cancelOrderPayloadSchema.parse(value ?? {});
const parseReturnOrderPayload = (value) => returnOrderPayloadSchema.parse(value ?? {});
const parseAdjustInventoryPayload = (value) => adjustInventoryPayloadSchema.parse(value ?? {});

export {
  parsePharmacyWorkspaceId,
  parsePharmacyWorkbenchListParams,
  parseInventoryStockListParams,
  parseResolvePharmacyLegacyRouteParams,
  parsePharmacyWorkbenchRouteState,
  parsePrepareDispensePayload,
  parseAttestDispensePayload,
  parseCancelOrderPayload,
  parseReturnOrderPayload,
  parseAdjustInventoryPayload,
};
