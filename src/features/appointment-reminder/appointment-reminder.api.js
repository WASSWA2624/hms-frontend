/**
 * Appointment Reminder API
 * File: appointment-reminder.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const appointmentReminderApi = createCrudApi(endpoints.APPOINTMENT_REMINDERS);

export { appointmentReminderApi };
