/**
 * Appointment Reminder Usecase Tests
 * File: appointment-reminder.usecase.test.js
 */
import { endpoints } from '@config/endpoints';
import {
  listAppointmentReminders,
  getAppointmentReminder,
  createAppointmentReminder,
  updateAppointmentReminder,
  deleteAppointmentReminder,
  markAppointmentReminderSent,
} from '@features/appointment-reminder';
import { appointmentReminderApi } from '@features/appointment-reminder/appointment-reminder.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/appointment-reminder/appointment-reminder.api', () => ({
  appointmentReminderApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    markSent: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('appointment-reminder.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    appointmentReminderApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    appointmentReminderApi.get.mockResolvedValue({ data: { id: '1' } });
    appointmentReminderApi.create.mockResolvedValue({ data: { id: '1' } });
    appointmentReminderApi.update.mockResolvedValue({ data: { id: '1' } });
    appointmentReminderApi.remove.mockResolvedValue({ data: { id: '1' } });
    appointmentReminderApi.markSent.mockResolvedValue({
      data: { id: '1', sent_at: '2026-01-01T00:00:00.000Z' },
    });
  });

  runCrudUsecaseTests(
    {
      list: listAppointmentReminders,
      get: getAppointmentReminder,
      create: createAppointmentReminder,
      update: updateAppointmentReminder,
      remove: deleteAppointmentReminder,
    },
    { queueRequestIfOffline }
  );

  it('marks reminder sent online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(markAppointmentReminderSent('1', { sent_at: '2026-01-01T00:00:00.000Z' })).resolves.toMatchObject({
      id: '1',
      sent_at: '2026-01-01T00:00:00.000Z',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.APPOINTMENT_REMINDERS.MARK_SENT('1'),
      method: 'POST',
      body: { sent_at: '2026-01-01T00:00:00.000Z' },
    });
    expect(appointmentReminderApi.markSent).toHaveBeenCalledWith('1', { sent_at: '2026-01-01T00:00:00.000Z' });
  });

  it('queues mark reminder sent offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    await expect(markAppointmentReminderSent('1', { sent_at: '2026-01-01T00:00:00.000Z' })).resolves.toMatchObject({
      id: '1',
      sent_at: '2026-01-01T00:00:00.000Z',
    });
    expect(appointmentReminderApi.markSent).not.toHaveBeenCalled();
  });

  it('rejects invalid id for mark sent', async () => {
    await expect(markAppointmentReminderSent(null, {})).rejects.toBeDefined();
  });
});
