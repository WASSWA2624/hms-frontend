/**
 * Appointment Reminder Model
 * File: appointment-reminder.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeAppointmentReminder = (value) => normalize(value);
const normalizeAppointmentReminderList = (value) => normalizeList(value);

export { normalizeAppointmentReminder, normalizeAppointmentReminderList };
