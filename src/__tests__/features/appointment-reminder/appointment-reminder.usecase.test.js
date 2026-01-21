/**
 * Appointment Reminder Usecase Tests
 * File: appointment-reminder.usecase.test.js
 */
import {
  listAppointmentReminders,
  getAppointmentReminder,
  createAppointmentReminder,
  updateAppointmentReminder,
  deleteAppointmentReminder,
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
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('appointment-reminder.usecase', () => {
  beforeEach(() => {
    appointmentReminderApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    appointmentReminderApi.get.mockResolvedValue({ data: { id: '1' } });
    appointmentReminderApi.create.mockResolvedValue({ data: { id: '1' } });
    appointmentReminderApi.update.mockResolvedValue({ data: { id: '1' } });
    appointmentReminderApi.remove.mockResolvedValue({ data: { id: '1' } });
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
});
