import { z } from 'zod';

const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const FRIENDLY_ID_REGEX = /^[A-Za-z][A-Za-z0-9_-]*$/;

const identifierSchema = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .refine(
    (value) => UUID_LIKE_REGEX.test(value) || FRIENDLY_ID_REGEX.test(value),
    'Invalid identifier format'
  );

const optionalIdentifierSchema = identifierSchema.optional().nullable();
const optionalStringSchema = z.string().trim().optional().nullable();

const queueSchema = z.enum([
  'NEEDS_ISSUE',
  'PENDING_PAYMENT',
  'CLAIMS_PENDING',
  'APPROVAL_REQUIRED',
  'OVERDUE',
]);

const decimalStringSchema = z
  .string()
  .trim()
  .regex(/^-?\d+(\.\d{1,2})?$/, 'Must be a valid decimal number');

const workspaceParamsSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  facility_id: optionalIdentifierSchema,
  patient_id: optionalIdentifierSchema,
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  search: optionalStringSchema,
});

const workItemsParamsSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  queue: queueSchema.optional(),
  facility_id: optionalIdentifierSchema,
  search: optionalStringSchema,
});

const ledgerParamsSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

const issueInvoicePayloadSchema = z.object({
  issued_at: z.string().datetime().optional().nullable(),
  notes: optionalStringSchema,
});

const sendInvoicePayloadSchema = z.object({
  recipient_email: z.string().trim().email().optional().nullable(),
  notes: optionalStringSchema,
});

const requestVoidPayloadSchema = z.object({
  reason: z.string().trim().min(2).max(255),
  notes: optionalStringSchema,
});

const reconcilePaymentPayloadSchema = z.object({
  status: z.enum(['COMPLETED', 'FAILED', 'REFUNDED']).optional(),
  notes: optionalStringSchema,
});

const requestRefundPayloadSchema = z.object({
  amount: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, 'Must be a valid amount')
    .optional(),
  reason: z.string().trim().min(2).max(255),
  notes: optionalStringSchema,
});

const requestAdjustmentPayloadSchema = z.object({
  invoice_id: identifierSchema,
  amount: decimalStringSchema,
  reason: z.string().trim().min(2).max(255),
  status: z.enum(['DRAFT', 'ISSUED', 'PAID', 'PARTIAL', 'CANCELLED']).optional(),
  adjusted_at: z.string().datetime().optional().nullable(),
  notes: optionalStringSchema,
});

const approveApprovalPayloadSchema = z.object({
  decision_notes: optionalStringSchema,
});

const rejectApprovalPayloadSchema = z.object({
  reason: z.string().trim().min(2).max(255),
  decision_notes: optionalStringSchema,
});

const parseWorkspaceParams = (value) => workspaceParamsSchema.parse(value ?? {});
const parseWorkItemsParams = (value) => workItemsParamsSchema.parse(value ?? {});
const parseLedgerParams = (value) => ledgerParamsSchema.parse(value ?? {});
const parseIdentifier = (value) => identifierSchema.parse(value);
const parseIssueInvoicePayload = (value) => issueInvoicePayloadSchema.parse(value ?? {});
const parseSendInvoicePayload = (value) => sendInvoicePayloadSchema.parse(value ?? {});
const parseRequestVoidPayload = (value) => requestVoidPayloadSchema.parse(value ?? {});
const parseReconcilePaymentPayload = (value) => reconcilePaymentPayloadSchema.parse(value ?? {});
const parseRequestRefundPayload = (value) => requestRefundPayloadSchema.parse(value ?? {});
const parseRequestAdjustmentPayload = (value) =>
  requestAdjustmentPayloadSchema.parse(value ?? {});
const parseApproveApprovalPayload = (value) => approveApprovalPayloadSchema.parse(value ?? {});
const parseRejectApprovalPayload = (value) => rejectApprovalPayloadSchema.parse(value ?? {});

export {
  parseWorkspaceParams,
  parseWorkItemsParams,
  parseLedgerParams,
  parseIdentifier,
  parseIssueInvoicePayload,
  parseSendInvoicePayload,
  parseRequestVoidPayload,
  parseReconcilePaymentPayload,
  parseRequestRefundPayload,
  parseRequestAdjustmentPayload,
  parseApproveApprovalPayload,
  parseRejectApprovalPayload,
};
