/**
 * Breach Notification Usecase Tests
 * File: breach-notification.usecase.test.js
 */
import {
  listBreachNotifications,
  getBreachNotification,
  createBreachNotification,
  updateBreachNotification,
  deleteBreachNotification,
} from '@features/breach-notification';
import { breachNotificationApi } from '@features/breach-notification/breach-notification.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/breach-notification/breach-notification.api', () => ({
  breachNotificationApi: {
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

describe('breach-notification.usecase', () => {
  beforeEach(() => {
    breachNotificationApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    breachNotificationApi.get.mockResolvedValue({ data: { id: '1' } });
    breachNotificationApi.create.mockResolvedValue({ data: { id: '1' } });
    breachNotificationApi.update.mockResolvedValue({ data: { id: '1' } });
    breachNotificationApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listBreachNotifications,
      get: getBreachNotification,
      create: createBreachNotification,
      update: updateBreachNotification,
      remove: deleteBreachNotification,
    },
    { queueRequestIfOffline }
  );
});
