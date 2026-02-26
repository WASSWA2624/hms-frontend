/**
 * Appointment Reminder API
 * File: appointment-reminder.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const appointmentReminderApi = createCrudApi(endpoints.APPOINTMENT_REMINDERS);

appointmentReminderApi.markSent = (id, payload = {}) =>
  apiClient({
    url: endpoints.APPOINTMENT_REMINDERS.MARK_SENT(id),
    method: 'POST',
    body: payload,
  });

export { appointmentReminderApi };
