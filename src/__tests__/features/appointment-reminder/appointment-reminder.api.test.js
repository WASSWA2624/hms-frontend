/**
 * Appointment Reminder API Tests
 * File: appointment-reminder.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { appointmentReminderApi } from '@features/appointment-reminder/appointment-reminder.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('appointment-reminder.api', () => {
  it('creates crud api with appointment reminder endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.APPOINTMENT_REMINDERS);
    expect(appointmentReminderApi).toBeDefined();
  });
});
