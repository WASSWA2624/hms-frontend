/**
 * Notification Usecase Tests
 * File: notification.usecase.test.js
 */
import {
  createNotification,
  deleteNotification,
  getNotification,
  listNotifications,
  markNotificationRead,
  markNotificationUnread,
  updateNotification,
} from '@features/notification';
import { notificationApi } from '@features/notification/notification.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/notification/notification.api', () => ({
  notificationApi: {
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

describe('notification.usecase', () => {
  beforeEach(() => {
    notificationApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    notificationApi.get.mockResolvedValue({ data: { id: '1' } });
    notificationApi.create.mockResolvedValue({ data: { id: '1' } });
    notificationApi.update.mockResolvedValue({ data: { id: '1' } });
    notificationApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listNotifications,
      get: getNotification,
      create: createNotification,
      update: updateNotification,
      remove: deleteNotification,
    },
    { queueRequestIfOffline }
  );

  it('marks notifications read/unread online via update', async () => {
    queueRequestIfOffline.mockResolvedValue(false);
    notificationApi.update.mockClear();
    notificationApi.update
      .mockResolvedValueOnce({ data: { id: '1', read: true, is_read: true } })
      .mockResolvedValueOnce({ data: { id: '1', read: false, is_read: false } });

    await expect(markNotificationRead('1')).resolves.toEqual({
      id: '1',
      read: true,
      is_read: true,
    });
    expect(notificationApi.update).toHaveBeenNthCalledWith(
      1,
      '1',
      expect.objectContaining({
        read: true,
        is_read: true,
      })
    );

    await expect(markNotificationUnread('1')).resolves.toEqual({
      id: '1',
      read: false,
      is_read: false,
    });
    expect(notificationApi.update).toHaveBeenNthCalledWith(2, '1', {
      read: false,
      is_read: false,
      read_at: null,
      readAt: null,
    });
  });

  it('queues read/unread updates when offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    const markedRead = await markNotificationRead('1');
    expect(markedRead).toEqual(
      expect.objectContaining({
        id: '1',
        read: true,
        is_read: true,
      })
    );
    expect(markedRead.read_at).toEqual(expect.any(String));
    expect(markedRead.readAt).toEqual(markedRead.read_at);

    await expect(markNotificationUnread('1')).resolves.toEqual({
      id: '1',
      read: false,
      is_read: false,
      read_at: null,
      readAt: null,
    });
  });
});
