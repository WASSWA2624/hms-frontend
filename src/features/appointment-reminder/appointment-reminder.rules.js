/**
 * Appointment Reminder Rules
 * File: appointment-reminder.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseAppointmentReminderId = (value) => parseId(value);
const parseAppointmentReminderPayload = (value) => parsePayload(value);
const parseAppointmentReminderListParams = (value) => parseListParams(value);

export {
  parseAppointmentReminderId,
  parseAppointmentReminderPayload,
  parseAppointmentReminderListParams,
};
