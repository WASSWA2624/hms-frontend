/**
 * Appointment Reminder API Tests
 * File: appointment-reminder.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { appointmentReminderApi } from '@features/appointment-reminder/appointment-reminder.api';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('appointment-reminder.api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates crud api with appointment reminder endpoints', () => {
    expect(appointmentReminderApi).toBeDefined();
  });

  it('posts mark-sent action', async () => {
    await appointmentReminderApi.markSent('1', { sent_at: '2026-01-01T00:00:00.000Z' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.APPOINTMENT_REMINDERS.MARK_SENT('1'),
      method: 'POST',
      body: { sent_at: '2026-01-01T00:00:00.000Z' },
    });
  });
});
