/**
 * Appointment Rules
 * File: appointment.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseAppointmentId = (value) => parseId(value);
const parseAppointmentPayload = (value) => parsePayload(value);
const parseAppointmentListParams = (value) => parseListParams(value);

export { parseAppointmentId, parseAppointmentPayload, parseAppointmentListParams };
