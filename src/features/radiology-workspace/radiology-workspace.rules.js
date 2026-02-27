import { z } from 'zod';

const FRIENDLY_ID_REGEX = /^[A-Za-z][A-Za-z0-9_-]*$/;
const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const LEGACY_RESOURCE_VALUES = [
  'radiology-orders',
  'radiology-results',
  'radiology-tests',
  'imaging-studies',
  'imaging-assets',
  'pacs-links',
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

const modalitySchema = z.enum([
  'XRAY',
  'CT',
  'MRI',
  'ULTRASOUND',
  'PET',
  'ECG',
  'ECHO',
  'ENDO',
  'GASTRO',
  'OTHER',
]);

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
  stage: z
    .enum(['ALL', 'ORDERED', 'PROCESSING', 'REPORTING', 'COMPLETED', 'CANCELLED'])
    .optional(),
  status: z.enum(['ORDERED', 'IN_PROCESS', 'COMPLETED', 'CANCELLED']).optional(),
  modality: modalitySchema.optional(),
  from: z.string().trim().optional(),
  to: z.string().trim().optional(),
  patient_id: identifierSchema.optional(),
  encounter_id: optionalIdentifierSchema,
  search: z.string().trim().optional(),
});

const resolveLegacyResourceSchema = z.enum(LEGACY_RESOURCE_VALUES);
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

const assignPayloadSchema = z.object({
  assignee_user_id: optionalIdentifierSchema,
  notes: z.string().trim().max(5000).optional().nullable(),
});

const startPayloadSchema = z.object({
  started_at: isoDateTimeSchema.optional(),
  notes: z.string().trim().max(5000).optional().nullable(),
});

const completePayloadSchema = z.object({
  completed_at: isoDateTimeSchema.optional(),
  notes: z.string().trim().max(5000).optional().nullable(),
});

const cancelPayloadSchema = z.object({
  reason: z.string().trim().min(2).max(500),
  cancelled_at: isoDateTimeSchema.optional(),
  notes: z.string().trim().max(5000).optional().nullable(),
});

const createStudyPayloadSchema = z.object({
  modality: modalitySchema.optional(),
  performed_at: isoDateTimeSchema.optional(),
  notes: z.string().trim().max(5000).optional().nullable(),
});

const initUploadPayloadSchema = z.object({
  file_name: z.string().trim().min(1).max(255),
  content_type: z.string().trim().max(120).optional().nullable(),
  size_bytes: z.coerce.number().int().positive().optional(),
});

const commitUploadPayloadSchema = z.object({
  storage_key: z.string().trim().min(1).max(255),
  file_name: z.string().trim().max(255).optional().nullable(),
  content_type: z.string().trim().max(120).optional().nullable(),
  upload_token: z.string().trim().max(255).optional().nullable(),
});

const syncStudyPayloadSchema = z.object({
  study_uid: z.string().trim().max(255).optional().nullable(),
  instances: z.array(z.any()).optional(),
  metadata: z.array(z.record(z.any())).optional(),
  notes: z.string().trim().max(5000).optional().nullable(),
});

const draftResultPayloadSchema = z.object({
  report_text: z.string().trim().max(20000).optional().nullable(),
  findings: z.string().trim().max(20000).optional().nullable(),
  impression: z.string().trim().max(20000).optional().nullable(),
  reported_at: isoDateTimeSchema.optional(),
});

const finalizeResultPayloadSchema = z.object({
  report_text: z.string().trim().max(20000).optional().nullable(),
  reported_at: isoDateTimeSchema.optional(),
  notes: z.string().trim().max(5000).optional().nullable(),
});

const addendumResultPayloadSchema = z.object({
  addendum_text: z.string().trim().min(2).max(20000),
  reported_at: isoDateTimeSchema.optional(),
  notes: z.string().trim().max(5000).optional().nullable(),
});

const parseRadiologyWorkspaceListParams = (value) => listParamsSchema.parse(value ?? {});
const parseRadiologyWorkspaceId = (value) => identifierSchema.parse(value);
const parseResolveRadiologyLegacyRouteParams = (value) =>
  resolveLegacyRouteParamsSchema.parse(value ?? {});
const parseRadiologyWorkbenchRouteState = (value) =>
  workbenchRouteStateSchema.parse({
    id: normalizeRouteStateValue(value?.id),
    panel: normalizeRouteStateValue(value?.panel),
    action: normalizeRouteStateValue(value?.action),
    resource: normalizeRouteStateValue(value?.resource),
    legacyId: normalizeRouteStateValue(value?.legacyId),
    patientId: normalizeRouteStateValue(value?.patientId),
    encounterId: normalizeRouteStateValue(value?.encounterId),
  });
const parseAssignRadiologyOrderPayload = (value) => assignPayloadSchema.parse(value ?? {});
const parseStartRadiologyOrderPayload = (value) => startPayloadSchema.parse(value ?? {});
const parseCompleteRadiologyOrderPayload = (value) => completePayloadSchema.parse(value ?? {});
const parseCancelRadiologyOrderPayload = (value) => cancelPayloadSchema.parse(value ?? {});
const parseCreateRadiologyStudyPayload = (value) => createStudyPayloadSchema.parse(value ?? {});
const parseInitUploadPayload = (value) => initUploadPayloadSchema.parse(value ?? {});
const parseCommitUploadPayload = (value) => commitUploadPayloadSchema.parse(value ?? {});
const parseSyncStudyPayload = (value) => syncStudyPayloadSchema.parse(value ?? {});
const parseDraftResultPayload = (value) => draftResultPayloadSchema.parse(value ?? {});
const parseFinalizeResultPayload = (value) => finalizeResultPayloadSchema.parse(value ?? {});
const parseAddendumResultPayload = (value) => addendumResultPayloadSchema.parse(value ?? {});

export {
  parseRadiologyWorkspaceListParams,
  parseRadiologyWorkspaceId,
  parseResolveRadiologyLegacyRouteParams,
  parseRadiologyWorkbenchRouteState,
  parseAssignRadiologyOrderPayload,
  parseStartRadiologyOrderPayload,
  parseCompleteRadiologyOrderPayload,
  parseCancelRadiologyOrderPayload,
  parseCreateRadiologyStudyPayload,
  parseInitUploadPayload,
  parseCommitUploadPayload,
  parseSyncStudyPayload,
  parseDraftResultPayload,
  parseFinalizeResultPayload,
  parseAddendumResultPayload,
};

