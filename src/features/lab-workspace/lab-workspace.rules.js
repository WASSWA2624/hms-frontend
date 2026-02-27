/**
 * Lab Workspace Rules
 * File: lab-workspace.rules.js
 */
import { z } from 'zod';

const FRIENDLY_ID_REGEX = /^[A-Za-z][A-Za-z0-9_-]*$/;
const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

const listParamsSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  sort_by: z.enum(['ordered_at', 'updated_at', 'status']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  stage: z.enum(['ALL', 'COLLECTION', 'PROCESSING', 'RESULTS', 'COMPLETED', 'CANCELLED']).optional(),
  status: z.enum(['ORDERED', 'COLLECTED', 'IN_PROCESS', 'COMPLETED', 'CANCELLED']).optional(),
  criticality: z.enum(['ALL', 'CRITICAL', 'NON_CRITICAL']).optional(),
  from: z.string().trim().optional(),
  to: z.string().trim().optional(),
  patient_id: identifierSchema.optional(),
  encounter_id: optionalIdentifierSchema,
  search: z.string().trim().optional(),
});

const resolveLegacyResourceSchema = z.enum([
  'lab-orders',
  'lab-order-items',
  'lab-samples',
  'lab-results',
  'lab-tests',
  'lab-panels',
  'lab-qc-logs',
]);

const resolveLegacyRouteParamsSchema = z.object({
  resource: resolveLegacyResourceSchema,
  id: identifierSchema,
});

const workbenchRouteStateSchema = z.object({
  id: identifierSchema.optional(),
  panel: z.string().trim().min(1).max(64).optional(),
  action: z.string().trim().min(1).max(64).optional(),
  resource: resolveLegacyResourceSchema.optional(),
  legacyId: identifierSchema.optional(),
  patientId: identifierSchema.optional(),
  encounterId: identifierSchema.optional(),
});

const collectPayloadSchema = z.object({
  sample_id: optionalIdentifierSchema,
  collected_at: isoDateTimeSchema.optional(),
  notes: z.string().trim().max(5000).optional().nullable(),
});

const receivePayloadSchema = z.object({
  received_at: isoDateTimeSchema.optional(),
  notes: z.string().trim().max(5000).optional().nullable(),
});

const rejectPayloadSchema = z.object({
  reason: z.string().trim().max(500).optional().nullable(),
  notes: z.string().trim().max(5000).optional().nullable(),
});

const releasePayloadSchema = z.object({
  result_id: optionalIdentifierSchema,
  status: z.enum(['PENDING', 'NORMAL', 'ABNORMAL', 'CRITICAL']).optional(),
  result_value: z.string().trim().max(120).optional().nullable(),
  result_unit: z.string().trim().max(40).optional().nullable(),
  result_text: z.string().trim().max(5000).optional().nullable(),
  reported_at: isoDateTimeSchema.optional(),
  notes: z.string().trim().max(5000).optional().nullable(),
});

const parseLabWorkspaceListParams = (value) => listParamsSchema.parse(value ?? {});
const parseLabWorkspaceId = (value) => identifierSchema.parse(value);
const parseResolveLabLegacyRouteParams = (value) =>
  resolveLegacyRouteParamsSchema.parse(value ?? {});
const parseLabWorkbenchRouteState = (value) =>
  workbenchRouteStateSchema.parse({
    id: normalizeRouteStateValue(value?.id),
    panel: normalizeRouteStateValue(value?.panel),
    action: normalizeRouteStateValue(value?.action),
    resource: normalizeRouteStateValue(value?.resource),
    legacyId: normalizeRouteStateValue(value?.legacyId),
    patientId: normalizeRouteStateValue(value?.patientId),
    encounterId: normalizeRouteStateValue(value?.encounterId),
  });
const parseCollectLabOrderPayload = (value) =>
  collectPayloadSchema.parse(value ?? {});
const parseReceiveLabSamplePayload = (value) =>
  receivePayloadSchema.parse(value ?? {});
const parseRejectLabSamplePayload = (value) =>
  rejectPayloadSchema.parse(value ?? {});
const parseReleaseLabOrderItemPayload = (value) =>
  releasePayloadSchema.parse(value ?? {});

export {
  parseLabWorkspaceListParams,
  parseLabWorkspaceId,
  parseResolveLabLegacyRouteParams,
  parseLabWorkbenchRouteState,
  parseCollectLabOrderPayload,
  parseReceiveLabSamplePayload,
  parseRejectLabSamplePayload,
  parseReleaseLabOrderItemPayload,
};
