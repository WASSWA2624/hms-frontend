/**
 * Breach Notification API Tests
 * File: breach-notification.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { breachNotificationApi } from '@features/breach-notification/breach-notification.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('breach-notification.api', () => {
  it('creates crud api with breach notification endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.BREACH_NOTIFICATIONS);
    expect(breachNotificationApi).toBeDefined();
  });
});
