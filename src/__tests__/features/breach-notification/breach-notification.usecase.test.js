/**
 * Breach Notification Usecase Tests
 * File: breach-notification.usecase.test.js
 */
import {
  listBreachNotifications,
  getBreachNotification,
  createBreachNotification,
  updateBreachNotification,
  resolveBreachNotification,
} from '@features/breach-notification';
import { endpoints } from '@config/endpoints';
import { breachNotificationApi } from '@features/breach-notification/breach-notification.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/breach-notification/breach-notification.api', () => ({
  breachNotificationApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    resolve: jest.fn(),
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
    breachNotificationApi.resolve.mockResolvedValue({ data: { id: '1', status: 'RESOLVED' } });
  });

  runCrudUsecaseTests(
    {
      list: listBreachNotifications,
      get: getBreachNotification,
      create: createBreachNotification,
      update: updateBreachNotification,
    },
    { queueRequestIfOffline }
  );

  it('resolves breach notifications online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(
      resolveBreachNotification('1', { resolution_notes: 'Root cause fixed' })
    ).resolves.toEqual({
      id: '1',
      status: 'RESOLVED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.BREACH_NOTIFICATIONS.RESOLVE('1'),
      method: 'POST',
      body: { resolution_notes: 'Root cause fixed' },
    });
    expect(breachNotificationApi.resolve).toHaveBeenCalledWith('1', {
      resolution_notes: 'Root cause fixed',
    });
  });

  it('queues resolve action when offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);
    breachNotificationApi.resolve.mockClear();

    await expect(
      resolveBreachNotification('1', { resolution_notes: 'Root cause fixed' })
    ).resolves.toEqual({
      id: '1',
      status: 'RESOLVED',
      resolution_notes: 'Root cause fixed',
    });
    expect(breachNotificationApi.resolve).not.toHaveBeenCalled();
  });
});
