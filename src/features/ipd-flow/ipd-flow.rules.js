/**
 * IPD Flow Rules
 * File: ipd-flow.rules.js
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
  const normalized = String(value || '').trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return undefined;
};
const booleanLikeSchema = z
  .union([z.boolean(), z.string().trim().min(1)])
  .optional()
  .transform((value) => parseBooleanLike(value));
const normalizeRouteStateValue = (value) => {
  const normalized = Array.isArray(value) ? String(value[0] || '').trim() : String(value || '').trim();
  return normalized || undefined;
};

const listParamsSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  sort_by: z.string().trim().min(1).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  tenant_id: identifierSchema.optional(),
  facility_id: identifierSchema.optional(),
  patient_id: identifierSchema.optional(),
  include_icu: booleanLikeSchema,
  queue_scope: z.enum(['ACTIVE', 'ALL']).optional().default('ACTIVE'),
  icu_queue_scope: z.enum(['ACTIVE', 'WITH_ICU', 'ALL']).optional(),
  stage: z
    .enum([
      'ADMITTED_PENDING_BED',
      'ADMITTED_IN_BED',
      'TRANSFER_REQUESTED',
      'TRANSFER_IN_PROGRESS',
      'DISCHARGE_PLANNED',
      'DISCHARGED',
      'CANCELLED',
    ])
    .optional(),
  icu_status: z.enum(['ACTIVE', 'ENDED', 'NONE']).optional(),
  ward_id: identifierSchema.optional(),
  transfer_status: z
    .enum(['REQUESTED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .optional(),
  has_active_bed: booleanLikeSchema,
  has_critical_alert: booleanLikeSchema,
  critical_severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  search: z.string().trim().optional(),
});
const getParamsSchema = z.object({
  include_icu: booleanLikeSchema,
});
const resolveLegacyResourceSchema = z.enum([
  'admissions',
  'bed-assignments',
  'ward-rounds',
  'nursing-notes',
  'medication-administrations',
  'discharge-summaries',
  'transfer-requests',
  'icu-stays',
  'icu-observations',
  'critical-alerts',
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
});

const startPayloadSchema = z.object({
  tenant_id: identifierSchema.optional(),
  facility_id: optionalIdentifierSchema,
  patient_id: identifierSchema,
  encounter_id: optionalIdentifierSchema,
  admitted_at: isoDateTimeSchema.optional(),
  bed_id: optionalIdentifierSchema,
});

const assignBedPayloadSchema = z.object({
  bed_id: identifierSchema,
  assigned_at: isoDateTimeSchema.optional(),
});

const releaseBedPayloadSchema = z.object({
  released_at: isoDateTimeSchema.optional(),
});

const requestTransferPayloadSchema = z.object({
  from_ward_id: optionalIdentifierSchema,
  to_ward_id: identifierSchema,
  requested_at: isoDateTimeSchema.optional(),
});

const updateTransferPayloadSchema = z
  .object({
    transfer_request_id: optionalIdentifierSchema,
    action: z.enum(['APPROVE', 'START', 'COMPLETE', 'CANCEL']),
    to_bed_id: optionalIdentifierSchema,
  })
  .superRefine((value, ctx) => {
    if (value.action === 'COMPLETE' && !value.to_bed_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['to_bed_id'],
        message: 'to_bed_id is required for COMPLETE action',
      });
    }
  });

const addWardRoundPayloadSchema = z.object({
  round_at: isoDateTimeSchema.optional(),
  notes: z.string().trim().max(65535).optional().nullable(),
});

const addNursingNotePayloadSchema = z.object({
  nurse_user_id: optionalIdentifierSchema,
  note: z.string().trim().min(1).max(65535),
});

const addMedicationAdministrationPayloadSchema = z.object({
  prescription_id: optionalIdentifierSchema,
  administered_at: isoDateTimeSchema.optional(),
  dose: z.string().trim().min(1).max(80),
  unit: z.string().trim().max(40).optional().nullable(),
  route: z.enum(['ORAL', 'IV', 'IM', 'TOPICAL', 'INHALATION', 'OTHER']).optional(),
});

const planDischargePayloadSchema = z.object({
  summary: z.string().trim().min(1).max(65535),
  discharged_at: isoDateTimeSchema.optional().nullable(),
});

const finalizeDischargePayloadSchema = z.object({
  summary: z.string().trim().max(65535).optional().nullable(),
  discharged_at: isoDateTimeSchema.optional(),
});

const startIcuStayPayloadSchema = z.object({
  started_at: isoDateTimeSchema.optional(),
});

const endIcuStayPayloadSchema = z.object({
  icu_stay_id: optionalIdentifierSchema,
  ended_at: isoDateTimeSchema.optional(),
});

const addIcuObservationPayloadSchema = z.object({
  icu_stay_id: optionalIdentifierSchema,
  observed_at: isoDateTimeSchema.optional(),
  observation: z.string().trim().min(1).max(5000),
});

const addCriticalAlertPayloadSchema = z.object({
  icu_stay_id: optionalIdentifierSchema,
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  message: z.string().trim().min(1).max(2000),
});

const resolveCriticalAlertPayloadSchema = z.object({
  critical_alert_id: optionalIdentifierSchema,
});

const parseIpdFlowId = (value) => identifierSchema.parse(value);
const parseIpdFlowListParams = (value) => listParamsSchema.parse(value ?? {});
const parseGetIpdFlowParams = (value) => getParamsSchema.parse(value ?? {});
const parseResolveLegacyRouteParams = (value) => resolveLegacyRouteParamsSchema.parse(value ?? {});
const parseIpdWorkbenchRouteState = (value) =>
  workbenchRouteStateSchema.parse({
    id: normalizeRouteStateValue(value?.id),
    panel: normalizeRouteStateValue(value?.panel),
    action: normalizeRouteStateValue(value?.action),
    resource: normalizeRouteStateValue(value?.resource),
    legacyId: normalizeRouteStateValue(value?.legacyId),
  });
const parseStartIpdFlowPayload = (value) => startPayloadSchema.parse(value ?? {});
const parseAssignBedPayload = (value) => assignBedPayloadSchema.parse(value ?? {});
const parseReleaseBedPayload = (value) => releaseBedPayloadSchema.parse(value ?? {});
const parseRequestTransferPayload = (value) => requestTransferPayloadSchema.parse(value ?? {});
const parseUpdateTransferPayload = (value) => updateTransferPayloadSchema.parse(value ?? {});
const parseAddWardRoundPayload = (value) => addWardRoundPayloadSchema.parse(value ?? {});
const parseAddNursingNotePayload = (value) => addNursingNotePayloadSchema.parse(value ?? {});
const parseAddMedicationAdministrationPayload = (value) =>
  addMedicationAdministrationPayloadSchema.parse(value ?? {});
const parsePlanDischargePayload = (value) => planDischargePayloadSchema.parse(value ?? {});
const parseFinalizeDischargePayload = (value) =>
  finalizeDischargePayloadSchema.parse(value ?? {});
const parseStartIcuStayPayload = (value) => startIcuStayPayloadSchema.parse(value ?? {});
const parseEndIcuStayPayload = (value) => endIcuStayPayloadSchema.parse(value ?? {});
const parseAddIcuObservationPayload = (value) => addIcuObservationPayloadSchema.parse(value ?? {});
const parseAddCriticalAlertPayload = (value) => addCriticalAlertPayloadSchema.parse(value ?? {});
const parseResolveCriticalAlertPayload = (value) =>
  resolveCriticalAlertPayloadSchema.parse(value ?? {});

export {
  parseIpdFlowId,
  parseIpdFlowListParams,
  parseGetIpdFlowParams,
  parseResolveLegacyRouteParams,
  parseIpdWorkbenchRouteState,
  parseStartIpdFlowPayload,
  parseStartIcuStayPayload,
  parseEndIcuStayPayload,
  parseAddIcuObservationPayload,
  parseAddCriticalAlertPayload,
  parseResolveCriticalAlertPayload,
  parseAssignBedPayload,
  parseReleaseBedPayload,
  parseRequestTransferPayload,
  parseUpdateTransferPayload,
  parseAddWardRoundPayload,
  parseAddNursingNotePayload,
  parseAddMedicationAdministrationPayload,
  parsePlanDischargePayload,
  parseFinalizeDischargePayload,
};
