/**
 * OPD Flow Rules
 * File: opd-flow.rules.js
 */
import { z } from 'zod';
import { createCrudRules } from '@utils/crudRules';

const FRIENDLY_ID_REGEX = /^[A-Za-z][A-Za-z0-9_-]*$/;
const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const idSchema = z
  .string()
  .trim()
  .min(2)
  .max(64)
  .regex(FRIENDLY_ID_REGEX);
const scopeIdSchema = z
  .string()
  .trim()
  .min(2)
  .max(64)
  .refine(
    (value) => UUID_LIKE_REGEX.test(value) || FRIENDLY_ID_REGEX.test(value),
    'Invalid identifier format'
  );
const isoDateTimeSchema = z.string().datetime();
const decimalSchema = z.union([z.string().trim().min(1), z.coerce.number()]);

const arrivalModeSchema = z.enum(['WALK_IN', 'ONLINE_APPOINTMENT', 'EMERGENCY']);
const emergencySeveritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
const triageLevelSchema = z.enum([
  'LEVEL_1',
  'LEVEL_2',
  'LEVEL_3',
  'LEVEL_4',
  'LEVEL_5',
  'IMMEDIATE',
  'URGENT',
  'LESS_URGENT',
  'NON_URGENT',
]);
const paymentMethodSchema = z.enum([
  'CASH',
  'CREDIT_CARD',
  'DEBIT_CARD',
  'PREPAID_CARD',
  'GIFT_CARD',
  'VOUCHER',
  'BANK_CHECK',
  'MOBILE_MONEY',
  'BANK_TRANSFER',
  'INSURANCE',
  'OTHER',
]);
const paymentStatusSchema = z.enum(['PENDING', 'COMPLETED', 'FAILED']);
const vitalTypeSchema = z.enum([
  'TEMPERATURE',
  'BLOOD_PRESSURE',
  'HEART_RATE',
  'RESPIRATORY_RATE',
  'OXYGEN_SATURATION',
  'WEIGHT',
  'HEIGHT',
  'BMI',
]);
const diagnosisTypeSchema = z.enum(['PRIMARY', 'SECONDARY', 'DIFFERENTIAL']);
const labOrderStatusSchema = z.enum(['ORDERED', 'COLLECTED', 'IN_PROCESS', 'COMPLETED', 'CANCELLED']);
const radiologyOrderStatusSchema = z.enum(['ORDERED', 'IN_PROCESS', 'COMPLETED', 'CANCELLED']);
const prescriptionStatusSchema = z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED']);
const medicationRouteSchema = z.enum(['ORAL', 'IV', 'IM', 'TOPICAL', 'INHALATION', 'OTHER']);
const medicationFrequencySchema = z.enum(['ONCE', 'BID', 'TID', 'QID', 'PRN', 'STAT', 'CUSTOM']);
const dispositionDecisionSchema = z.enum(['ADMIT', 'SEND_TO_PHARMACY', 'DISCHARGE']);
const workflowStageSchema = z.enum([
  'WAITING_CONSULTATION_PAYMENT',
  'WAITING_VITALS',
  'WAITING_DOCTOR_ASSIGNMENT',
  'WAITING_DOCTOR_REVIEW',
  'LAB_REQUESTED',
  'RADIOLOGY_REQUESTED',
  'LAB_AND_RADIOLOGY_REQUESTED',
  'PHARMACY_REQUESTED',
  'WAITING_DISPOSITION',
  'ADMITTED',
  'DISCHARGED',
]);
const queueScopeSchema = z.enum(['ASSIGNED', 'WAITING', 'ALL']);
const bloodPressureValueRegex = /^(\d{2,3}(?:\.\d{1,2})?)\s*\/\s*(\d{2,3}(?:\.\d{1,2})?)$/;

const listParamsSchema = z
  .object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    sort_by: z.string().trim().min(1).optional(),
    order: z.enum(['asc', 'desc']).optional(),
    tenant_id: scopeIdSchema.optional(),
    facility_id: scopeIdSchema.optional(),
    patient_id: idSchema.optional(),
    provider_user_id: idSchema.optional(),
    encounter_type: z.enum(['OPD', 'EMERGENCY']).optional(),
    stage: workflowStageSchema.optional(),
    queue_scope: queueScopeSchema.optional(),
    search: z.string().trim().optional(),
  })
  .passthrough();

const patientRegistrationSchema = z.object({
  first_name: z.string().trim().min(1).max(120),
  last_name: z.string().trim().min(1).max(120),
  date_of_birth: isoDateTimeSchema.optional().nullable(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'UNKNOWN']).optional().nullable(),
});

const payNowSchema = z.object({
  method: paymentMethodSchema,
  amount: decimalSchema.optional(),
  status: paymentStatusSchema.optional(),
  transaction_ref: z.string().trim().max(120).optional().nullable(),
  paid_at: isoDateTimeSchema.optional(),
});

const emergencySchema = z.object({
  severity: emergencySeveritySchema.optional(),
  triage_level: triageLevelSchema.optional(),
  notes: z.string().trim().max(65535).optional().nullable(),
});

const startPayloadSchema = z
  .object({
    tenant_id: scopeIdSchema.optional(),
    facility_id: scopeIdSchema.optional().nullable(),
    patient_id: idSchema.optional(),
    patient_registration: patientRegistrationSchema.optional(),
    arrival_mode: arrivalModeSchema.optional(),
    appointment_id: idSchema.optional(),
    provider_user_id: idSchema.optional().nullable(),
    consultation_fee: decimalSchema.optional(),
    currency: z.string().trim().min(1).max(10).optional(),
    create_consultation_invoice: z.boolean().optional(),
    require_consultation_payment: z.boolean().optional(),
    pay_now: payNowSchema.optional(),
    emergency: emergencySchema.optional(),
    notes: z.string().trim().max(65535).optional().nullable(),
    queued_at: isoDateTimeSchema.optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.patient_id && !value.patient_registration && !value.appointment_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['patient_id'],
        message: 'patient_id or appointment_id is required',
      });
    }

    if (value.arrival_mode === 'ONLINE_APPOINTMENT' && !value.appointment_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['appointment_id'],
        message: 'appointment_id is required for ONLINE_APPOINTMENT',
      });
    }
  });

const payConsultationPayloadSchema = z.object({
  invoice_id: idSchema.optional(),
  amount: decimalSchema.optional(),
  currency: z.string().trim().min(1).max(10).optional(),
  method: paymentMethodSchema,
  status: paymentStatusSchema.optional(),
  transaction_ref: z.string().trim().max(120).optional().nullable(),
  paid_at: isoDateTimeSchema.optional(),
  notes: z.string().trim().max(10000).optional().nullable(),
});

const recordVitalRowSchema = z
  .object({
    vital_type: vitalTypeSchema,
    value: z.string().trim().min(1).max(80).optional(),
    unit: z.string().trim().max(20).optional().nullable(),
    systolic_value: decimalSchema.optional(),
    diastolic_value: decimalSchema.optional(),
    map_value: decimalSchema.optional(),
    recorded_at: isoDateTimeSchema.optional(),
  })
  .superRefine((value, ctx) => {
    if (value.vital_type === 'BLOOD_PRESSURE') {
      const hasStructuredComponents =
        value.systolic_value != null && value.diastolic_value != null;
      const hasLegacyValue =
        typeof value.value === 'string' && bloodPressureValueRegex.test(value.value.trim());

      if (!hasStructuredComponents && !hasLegacyValue) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['systolic_value'],
          message: 'systolic and diastolic values are required for blood pressure',
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['diastolic_value'],
          message: 'systolic and diastolic values are required for blood pressure',
        });
      }
      return;
    }

    if (!value.value) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['value'],
        message: 'value is required',
      });
    }
  });

const recordVitalsPayloadSchema = z.object({
  vitals: z.array(recordVitalRowSchema).min(1),
  triage_level: triageLevelSchema.optional(),
  triage_notes: z.string().trim().max(65535).optional().nullable(),
});

const assignDoctorPayloadSchema = z.object({
  provider_user_id: idSchema,
});

const doctorReviewPayloadSchema = z.object({
  note: z.string().trim().min(1).max(65535),
  diagnoses: z
    .array(
      z.object({
        diagnosis_type: diagnosisTypeSchema,
        code: z.string().trim().max(80).optional().nullable(),
        description: z.string().trim().min(1).max(65535),
      })
    )
    .optional(),
  procedures: z
    .array(
      z.object({
        code: z.string().trim().max(80).optional().nullable(),
        description: z.string().trim().min(1).max(65535),
        performed_at: isoDateTimeSchema.optional().nullable(),
      })
    )
    .optional(),
  lab_requests: z
    .array(
      z.object({
        lab_test_id: idSchema,
        status: labOrderStatusSchema.optional(),
      })
    )
    .optional(),
  radiology_requests: z
    .array(
      z.object({
        radiology_test_id: idSchema.optional().nullable(),
        status: radiologyOrderStatusSchema.optional(),
      })
    )
    .optional(),
  medications: z
    .array(
      z.object({
        drug_id: idSchema,
        quantity: z.coerce.number().int().positive(),
        dosage: z.string().trim().max(80).optional().nullable(),
        frequency: medicationFrequencySchema.optional().nullable(),
        route: medicationRouteSchema.optional().nullable(),
        status: prescriptionStatusSchema.optional(),
      })
    )
    .optional(),
  notes: z.string().trim().max(65535).optional().nullable(),
});

const dispositionPayloadSchema = z.object({
  decision: dispositionDecisionSchema,
  admission_facility_id: scopeIdSchema.optional().nullable(),
  notes: z.string().trim().max(65535).optional().nullable(),
});

const correctStagePayloadSchema = z.object({
  stage_to: workflowStageSchema,
  reason: z.string().trim().min(1).max(2000),
});

const bootstrapPayloadSchema = z.object({
  patient_id: idSchema,
  facility_id: scopeIdSchema.optional().nullable(),
  provider_user_id: idSchema.optional().nullable(),
  encounter_type: z.enum(['OPD', 'EMERGENCY']).optional(),
  reuse_open_encounter: z.boolean().optional(),
});

const parseOpdFlowId = (value) => idSchema.parse(value);
const parseOpdFlowListParams = (value) => listParamsSchema.parse(value ?? {});
const parseStartOpdFlowPayload = (value) => startPayloadSchema.parse(value ?? {});
const parsePayConsultationPayload = (value) => payConsultationPayloadSchema.parse(value ?? {});
const parseRecordVitalsPayload = (value) => recordVitalsPayloadSchema.parse(value ?? {});
const parseAssignDoctorPayload = (value) => assignDoctorPayloadSchema.parse(value ?? {});
const parseDoctorReviewPayload = (value) => doctorReviewPayloadSchema.parse(value ?? {});
const parseDispositionPayload = (value) => dispositionPayloadSchema.parse(value ?? {});
const parseCorrectStagePayload = (value) => correctStagePayloadSchema.parse(value ?? {});
const parseBootstrapOpdFlowPayload = (value) => bootstrapPayloadSchema.parse(value ?? {});

export {
  parseOpdFlowId,
  parseOpdFlowListParams,
  parseStartOpdFlowPayload,
  parsePayConsultationPayload,
  parseRecordVitalsPayload,
  parseAssignDoctorPayload,
  parseDoctorReviewPayload,
  parseDispositionPayload,
  parseCorrectStagePayload,
  parseBootstrapOpdFlowPayload,
};
