/**
 * Theatre Flow Rules
 * File: theatre-flow.rules.js
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

const parseBooleanLike = (value) => {
  if (typeof value === 'boolean') return value;
  const normalized = String(value || '')
    .trim()
    .toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return undefined;
};

const booleanLikeSchema = z
  .union([z.boolean(), z.string().trim().min(1)])
  .optional()
  .transform((value) => parseBooleanLike(value));

const normalizeRouteStateValue = (value) => {
  const normalized = Array.isArray(value)
    ? String(value[0] || '').trim()
    : String(value || '').trim();
  return normalized || undefined;
};

const theatreFlowStageSchema = z.enum([
  'PRE_OP',
  'SIGN_IN',
  'TIME_OUT',
  'INTRA_OP',
  'SIGN_OUT',
  'POST_OP',
  'PACU_HANDOFF',
  'COMPLETED',
]);

const theatreFlowStatusSchema = z.enum([
  'SCHEDULED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);

const recordStatusSchema = z.enum(['DRAFT', 'FINAL']);
const checklistPhaseSchema = z.enum([
  'PRE_OP',
  'SIGN_IN',
  'TIME_OUT',
  'SIGN_OUT',
  'PACU_HANDOFF',
]);
const resourceTypeSchema = z.enum(['ROOM', 'STAFF', 'EQUIPMENT']);
const staffRoleSchema = z.enum(['SURGEON', 'ANESTHETIST']);
const recordTypeSchema = z.enum(['ANESTHESIA', 'POST_OP', 'ALL']);
const legacyResourceSchema = z.enum([
  'theatre-cases',
  'anesthesia-records',
  'post-op-notes',
]);

const listParamsSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  sort_by: z.string().trim().min(1).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  tenant_id: identifierSchema.optional(),
  facility_id: identifierSchema.optional(),
  patient_id: identifierSchema.optional(),
  encounter_id: identifierSchema.optional(),
  queue_scope: z.enum(['ACTIVE', 'ALL']).optional().default('ACTIVE'),
  status: theatreFlowStatusSchema.optional(),
  stage: theatreFlowStageSchema.optional(),
  room_id: identifierSchema.optional(),
  surgeon_user_id: identifierSchema.optional(),
  anesthetist_user_id: identifierSchema.optional(),
  anesthesia_status: recordStatusSchema.optional(),
  post_op_status: recordStatusSchema.optional(),
  scheduled_from: isoDateTimeSchema.optional(),
  scheduled_to: isoDateTimeSchema.optional(),
  finalized: booleanLikeSchema,
  search: z.string().trim().optional(),
});

const getParamsSchema = z.object({
  include_timeline: booleanLikeSchema,
});

const resolveLegacyRouteParamsSchema = z.object({
  resource: legacyResourceSchema,
  id: identifierSchema,
});

const workbenchRouteStateSchema = z.object({
  id: identifierSchema.optional(),
  panel: z.string().trim().min(1).max(64).optional(),
  action: z.string().trim().min(1).max(80).optional(),
  resource: legacyResourceSchema.optional(),
  legacyId: identifierSchema.optional(),
});

const startPayloadSchema = z.object({
  encounter_id: identifierSchema,
  scheduled_at: isoDateTimeSchema.optional(),
  status: theatreFlowStatusSchema.optional(),
  room_id: optionalIdentifierSchema,
  surgeon_user_id: optionalIdentifierSchema,
  anesthetist_user_id: optionalIdentifierSchema,
  workflow_stage: theatreFlowStageSchema.optional(),
  stage_notes: z.string().trim().max(65535).optional().nullable(),
});

const updateStagePayloadSchema = z.object({
  workflow_stage: theatreFlowStageSchema.optional(),
  status: theatreFlowStatusSchema.optional(),
  stage_notes: z.string().trim().max(65535).optional().nullable(),
  started_at: isoDateTimeSchema.optional().nullable(),
  completed_at: isoDateTimeSchema.optional().nullable(),
  cancelled_at: isoDateTimeSchema.optional().nullable(),
});

const upsertAnesthesiaRecordPayloadSchema = z.object({
  anesthesia_record_id: optionalIdentifierSchema,
  anesthetist_user_id: optionalIdentifierSchema,
  notes: z.string().trim().max(65535).optional().nullable(),
  record_status: recordStatusSchema.optional(),
});

const addAnesthesiaObservationPayloadSchema = z.object({
  observed_at: isoDateTimeSchema.optional(),
  observation_type: z.string().trim().max(80).optional().nullable(),
  metric_key: z.string().trim().max(80).optional().nullable(),
  metric_value: z.string().trim().max(120).optional().nullable(),
  unit: z.string().trim().max(40).optional().nullable(),
  notes: z.string().trim().max(65535).optional().nullable(),
  observed_by_user_id: optionalIdentifierSchema,
});

const upsertPostOpNotePayloadSchema = z.object({
  post_op_note_id: optionalIdentifierSchema,
  note: z.string().trim().min(1).max(65535),
  record_status: recordStatusSchema.optional(),
});

const toggleChecklistItemPayloadSchema = z.object({
  checklist_item_id: optionalIdentifierSchema,
  phase: checklistPhaseSchema,
  item_code: z.string().trim().min(1).max(120),
  item_label: z.string().trim().max(255).optional().nullable(),
  is_checked: booleanLikeSchema,
  notes: z.string().trim().max(65535).optional().nullable(),
});

const assignResourcePayloadSchema = z.object({
  resource_type: resourceTypeSchema,
  resource_id: identifierSchema,
  staff_role: staffRoleSchema.optional(),
  notes: z.string().trim().max(65535).optional().nullable(),
});

const releaseResourcePayloadSchema = z.object({
  allocation_id: optionalIdentifierSchema,
  resource_type: resourceTypeSchema.optional(),
  resource_id: optionalIdentifierSchema,
  released_at: isoDateTimeSchema.optional(),
  notes: z.string().trim().max(65535).optional().nullable(),
});

const finalizeRecordPayloadSchema = z.object({
  record_type: recordTypeSchema.optional().default('ALL'),
  anesthesia_record_id: optionalIdentifierSchema,
  post_op_note_id: optionalIdentifierSchema,
});

const reopenRecordPayloadSchema = z.object({
  record_type: recordTypeSchema.optional().default('ALL'),
  anesthesia_record_id: optionalIdentifierSchema,
  post_op_note_id: optionalIdentifierSchema,
  reason: z.string().trim().min(3).max(65535),
});

const parseTheatreFlowId = (value) => identifierSchema.parse(value);
const parseTheatreFlowListParams = (value) => listParamsSchema.parse(value ?? {});
const parseGetTheatreFlowParams = (value) => getParamsSchema.parse(value ?? {});
const parseResolveTheatreLegacyRouteParams = (value) =>
  resolveLegacyRouteParamsSchema.parse(value ?? {});
const parseTheatreWorkbenchRouteState = (value) =>
  workbenchRouteStateSchema.parse({
    id: normalizeRouteStateValue(value?.id),
    panel: normalizeRouteStateValue(value?.panel),
    action: normalizeRouteStateValue(value?.action),
    resource: normalizeRouteStateValue(value?.resource),
    legacyId: normalizeRouteStateValue(value?.legacyId),
  });
const parseStartTheatreFlowPayload = (value) =>
  startPayloadSchema.parse(value ?? {});
const parseUpdateStagePayload = (value) =>
  updateStagePayloadSchema.parse(value ?? {});
const parseUpsertAnesthesiaRecordPayload = (value) =>
  upsertAnesthesiaRecordPayloadSchema.parse(value ?? {});
const parseAddAnesthesiaObservationPayload = (value) =>
  addAnesthesiaObservationPayloadSchema.parse(value ?? {});
const parseUpsertPostOpNotePayload = (value) =>
  upsertPostOpNotePayloadSchema.parse(value ?? {});
const parseToggleChecklistItemPayload = (value) =>
  toggleChecklistItemPayloadSchema.parse(value ?? {});
const parseAssignResourcePayload = (value) =>
  assignResourcePayloadSchema.parse(value ?? {});
const parseReleaseResourcePayload = (value) =>
  releaseResourcePayloadSchema.parse(value ?? {});
const parseFinalizeRecordPayload = (value) =>
  finalizeRecordPayloadSchema.parse(value ?? {});
const parseReopenRecordPayload = (value) =>
  reopenRecordPayloadSchema.parse(value ?? {});

export {
  parseTheatreFlowId,
  parseTheatreFlowListParams,
  parseGetTheatreFlowParams,
  parseResolveTheatreLegacyRouteParams,
  parseTheatreWorkbenchRouteState,
  parseStartTheatreFlowPayload,
  parseUpdateStagePayload,
  parseUpsertAnesthesiaRecordPayload,
  parseAddAnesthesiaObservationPayload,
  parseUpsertPostOpNotePayload,
  parseToggleChecklistItemPayload,
  parseAssignResourcePayload,
  parseReleaseResourcePayload,
  parseFinalizeRecordPayload,
  parseReopenRecordPayload,
};
