/**
 * Appointment Reminder Use Cases
 * File: appointment-reminder.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { appointmentReminderApi } from './appointment-reminder.api';
import { normalizeAppointmentReminder, normalizeAppointmentReminderList } from './appointment-reminder.model';
import {
  parseAppointmentReminderId,
  parseAppointmentReminderListParams,
  parseAppointmentReminderPayload,
} from './appointment-reminder.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listAppointmentReminders = async (params = {}) =>
  execute(async () => {
    const parsed = parseAppointmentReminderListParams(params);
    const response = await appointmentReminderApi.list(parsed);
    return normalizeAppointmentReminderList(response.data);
  });

const getAppointmentReminder = async (id) =>
  execute(async () => {
    const parsedId = parseAppointmentReminderId(id);
    const response = await appointmentReminderApi.get(parsedId);
    return normalizeAppointmentReminder(response.data);
  });

const createAppointmentReminder = async (payload) =>
  execute(async () => {
    const parsed = parseAppointmentReminderPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.APPOINTMENT_REMINDERS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeAppointmentReminder(parsed);
    }
    const response = await appointmentReminderApi.create(parsed);
    return normalizeAppointmentReminder(response.data);
  });

const updateAppointmentReminder = async (id, payload) =>
  execute(async () => {
    const parsedId = parseAppointmentReminderId(id);
    const parsed = parseAppointmentReminderPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.APPOINTMENT_REMINDERS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeAppointmentReminder({ id: parsedId, ...parsed });
    }
    const response = await appointmentReminderApi.update(parsedId, parsed);
    return normalizeAppointmentReminder(response.data);
  });

const deleteAppointmentReminder = async (id) =>
  execute(async () => {
    const parsedId = parseAppointmentReminderId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.APPOINTMENT_REMINDERS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeAppointmentReminder({ id: parsedId });
    }
    const response = await appointmentReminderApi.remove(parsedId);
    return normalizeAppointmentReminder(response.data);
  });

const markAppointmentReminderSent = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseAppointmentReminderId(id);
    const parsed = parseAppointmentReminderPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.APPOINTMENT_REMINDERS.MARK_SENT(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeAppointmentReminder({
        id: parsedId,
        sent_at: parsed.sent_at || new Date().toISOString(),
      });
    }
    const response = await appointmentReminderApi.markSent(parsedId, parsed);
    return normalizeAppointmentReminder(response.data);
  });

export {
  listAppointmentReminders,
  getAppointmentReminder,
  createAppointmentReminder,
  updateAppointmentReminder,
  deleteAppointmentReminder,
  markAppointmentReminderSent,
};
