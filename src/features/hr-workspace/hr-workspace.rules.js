import { z } from 'zod';

const FRIENDLY_ID_REGEX = /^[A-Za-z][A-Za-z0-9_-]*$/;
const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const WORKBENCH_PANEL_VALUES = [
  'overview',
  'staffing',
  'roster',
  'shifts',
  'payroll',
  'onboarding',
];

const LEGACY_RESOURCE_VALUES = [
  'staff-positions',
  'staff-profiles',
  'staff-assignments',
  'staff-leaves',
  'shifts',
  'shift-assignments',
  'shift-swap-requests',
  'nurse-rosters',
  'shift-templates',
  'roster-day-offs',
  'staff-availabilities',
  'payroll-runs',
  'payroll-items',
  'doctors',
];

const queueValues = [
  'LEAVE_REQUESTS',
  'SWAP_REQUESTS',
  'ROSTER_DRAFTS',
  'UNASSIGNED_SHIFTS',
  'PAYROLL_DRAFTS',
  'OVERDUE_SHIFTS',
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
const panelSchema = z.enum(WORKBENCH_PANEL_VALUES);

const normalizeRouteStateValue = (value) => {
  const normalized = Array.isArray(value)
    ? String(value[0] || '').trim()
    : String(value || '').trim();
  return normalized || undefined;
};

const workspaceListParamsSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  facility_id: optionalIdentifierSchema,
  department_id: optionalIdentifierSchema,
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  search: z.string().trim().optional(),
});

const workItemsParamsSchema = workspaceListParamsSchema.extend({
  queue: z.enum(queueValues).optional(),
});

const payrollPreviewParamsSchema = z.object({
  facility_id: optionalIdentifierSchema,
  department_id: optionalIdentifierSchema,
});

const resolveLegacyParamsSchema = z.object({
  resource: z.enum(LEGACY_RESOURCE_VALUES),
  id: identifierSchema,
});

const workbenchRouteStateSchema = z.object({
  panel: panelSchema.optional(),
  resource: z.enum(LEGACY_RESOURCE_VALUES).optional(),
  legacyId: identifierSchema.optional(),
  action: z.string().trim().min(1).max(64).optional(),
  rosterId: identifierSchema.optional(),
  payrollRunId: identifierSchema.optional(),
  queue: z.enum(queueValues).optional(),
  search: z.string().trim().optional(),
  facilityId: identifierSchema.optional(),
  departmentId: identifierSchema.optional(),
});

const rosterGeneratePayloadSchema = z.object({
  constraints: z
    .object({
      max_shifts_per_nurse: z.coerce.number().int().positive().optional(),
      max_shifts_per_week: z.coerce.number().int().positive().optional(),
      max_hours_per_week: z.coerce.number().positive().optional(),
      min_rest_hours: z.coerce.number().nonnegative().optional(),
      max_consecutive_working_days: z.coerce.number().int().positive().optional(),
      skill_matching: z.coerce.boolean().optional(),
    })
    .optional(),
  replace_existing_assignments: z.coerce.boolean().optional(),
  dry_run: z.coerce.boolean().optional(),
});

const rosterPublishPayloadSchema = z.object({
  notify_staff: z.coerce.boolean().optional(),
  allow_partial_publish: z.coerce.boolean().optional(),
  publish_note: z.string().trim().min(2).max(255).optional().nullable(),
});

const shiftOverridePayloadSchema = z.object({
  staff_profile_id: identifierSchema,
  reason: z.string().trim().min(2).max(255),
});

const approvalPayloadSchema = z.object({
  reason: z.string().trim().max(255).optional().nullable(),
});

const rejectionPayloadSchema = z.object({
  reason: z.string().trim().min(2).max(255),
});

const payrollProcessPayloadSchema = z.object({
  replace_existing_items: z.coerce.boolean().optional(),
  notes: z.string().trim().max(255).optional().nullable(),
});

const parseHrWorkspaceIdentifier = (value) => identifierSchema.parse(value);
const parseHrWorkspaceListParams = (value) => workspaceListParamsSchema.parse(value ?? {});
const parseHrWorkItemsParams = (value) => workItemsParamsSchema.parse(value ?? {});
const parseHrPayrollPreviewParams = (value) => payrollPreviewParamsSchema.parse(value ?? {});
const parseHrResolveLegacyParams = (value) => resolveLegacyParamsSchema.parse(value ?? {});
const parseHrWorkbenchRouteState = (value) =>
  workbenchRouteStateSchema.parse({
    panel: normalizeRouteStateValue(value?.panel),
    resource: normalizeRouteStateValue(value?.resource),
    legacyId: normalizeRouteStateValue(value?.legacyId),
    action: normalizeRouteStateValue(value?.action),
    rosterId: normalizeRouteStateValue(value?.rosterId),
    payrollRunId: normalizeRouteStateValue(value?.payrollRunId),
    queue: normalizeRouteStateValue(value?.queue),
    search: normalizeRouteStateValue(value?.search),
    facilityId: normalizeRouteStateValue(value?.facilityId),
    departmentId: normalizeRouteStateValue(value?.departmentId),
  });
const parseHrRosterGeneratePayload = (value) => rosterGeneratePayloadSchema.parse(value ?? {});
const parseHrRosterPublishPayload = (value) => rosterPublishPayloadSchema.parse(value ?? {});
const parseHrShiftOverridePayload = (value) => shiftOverridePayloadSchema.parse(value ?? {});
const parseHrSwapApprovePayload = (value) => approvalPayloadSchema.parse(value ?? {});
const parseHrSwapRejectPayload = (value) => rejectionPayloadSchema.parse(value ?? {});
const parseHrLeaveApprovePayload = (value) => approvalPayloadSchema.parse(value ?? {});
const parseHrLeaveRejectPayload = (value) => rejectionPayloadSchema.parse(value ?? {});
const parseHrPayrollProcessPayload = (value) => payrollProcessPayloadSchema.parse(value ?? {});

export {
  WORKBENCH_PANEL_VALUES,
  queueValues,
  parseHrWorkspaceIdentifier,
  parseHrWorkspaceListParams,
  parseHrWorkItemsParams,
  parseHrPayrollPreviewParams,
  parseHrResolveLegacyParams,
  parseHrWorkbenchRouteState,
  parseHrRosterGeneratePayload,
  parseHrRosterPublishPayload,
  parseHrShiftOverridePayload,
  parseHrSwapApprovePayload,
  parseHrSwapRejectPayload,
  parseHrLeaveApprovePayload,
  parseHrLeaveRejectPayload,
  parseHrPayrollProcessPayload,
};
