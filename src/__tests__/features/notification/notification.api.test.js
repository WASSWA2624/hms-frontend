/**
 * Notification API Tests
 * File: notification.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { notificationApi } from '@features/notification/notification.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('notification.api', () => {
  it('creates crud api with notification endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.NOTIFICATIONS);
    expect(notificationApi).toBeDefined();
  });
});
