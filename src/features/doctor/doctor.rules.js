/**
 * Doctor Rules
 * File: doctor.rules.js
 */
import { z } from 'zod';

const FRIENDLY_ID_REGEX = /^(?=.*\d)[A-Za-z][A-Za-z0-9_-]*$/;
const idSchema = z
  .string()
  .trim()
  .min(2)
  .max(64)
  .regex(FRIENDLY_ID_REGEX)
  .transform((value) => value.toUpperCase());

const practitionerTypeSchema = z.enum(['MO', 'SPECIALIST']);
const statusSchema = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING']);
const decimalSchema = z.union([z.string().trim().min(1), z.coerce.number()]);

const recurringScheduleSchema = z.object({
  day_of_week: z.coerce.number().int().min(0).max(6),
  start_time: z.string().trim().datetime(),
  end_time: z.string().trim().datetime(),
  timezone: z.string().trim().min(1).max(64).optional(),
  effective_from: z.string().trim().datetime().optional().nullable(),
  effective_to: z.string().trim().datetime().optional().nullable(),
});

const scheduleOverrideSchema = z.object({
  schedule_index: z.coerce.number().int().min(0).optional(),
  override_date: z.string().trim().datetime(),
  start_time: z.string().trim().datetime(),
  end_time: z.string().trim().datetime(),
  is_available: z.boolean().optional(),
});

const createDoctorPayloadSchema = z.object({
  tenant_id: idSchema,
  facility_id: idSchema.optional().nullable(),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().nullable(),
  password: z.string().trim().min(8).max(255).optional(),
  status: statusSchema.optional(),
  position_title: z.string().trim().min(1).max(120),
  practitioner_type: practitionerTypeSchema,
  position_id: idSchema.optional(),
  position_name: z.string().trim().min(1).max(120).optional(),
  consultation_fee: decimalSchema.optional().nullable(),
  consultation_currency: z.string().trim().min(1).max(10).optional().nullable(),
  is_fee_overridden: z.boolean().optional(),
  role_ids: z.array(idSchema).optional().default([]),
  recurring_schedules: z.array(recurringScheduleSchema).optional().default([]),
  schedule_overrides: z.array(scheduleOverrideSchema).optional().default([]),
});

const updateDoctorPayloadSchema = createDoctorPayloadSchema
  .omit({ tenant_id: true, email: true, password: true, practitioner_type: true, position_title: true })
  .extend({
    email: z.string().trim().email().max(255).optional(),
    password: z.string().trim().min(8).max(255).optional(),
    practitioner_type: practitionerTypeSchema.optional(),
    position_title: z.string().trim().min(1).max(120).optional(),
  })
  .partial();

const listDoctorsParamsSchema = z
  .object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    sort_by: z.string().trim().min(1).optional(),
    order: z.enum(['asc', 'desc']).optional(),
    tenant_id: idSchema.optional(),
    facility_id: idSchema.optional(),
    practitioner_type: practitionerTypeSchema.optional(),
    position_title: z.string().trim().optional(),
    search: z.string().trim().optional(),
  })
  .passthrough();

const parseDoctorId = (value) => idSchema.parse(value);
const parseCreateDoctorPayload = (value) => createDoctorPayloadSchema.parse(value ?? {});
const parseUpdateDoctorPayload = (value) => updateDoctorPayloadSchema.parse(value ?? {});
const parseDoctorListParams = (value) => listDoctorsParamsSchema.parse(value ?? {});

export {
  parseDoctorId,
  parseCreateDoctorPayload,
  parseUpdateDoctorPayload,
  parseDoctorListParams,
};
