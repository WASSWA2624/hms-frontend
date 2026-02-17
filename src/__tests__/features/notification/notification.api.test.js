/**
 * Notification API Tests
 * File: notification.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';
import {
  getNotificationApi,
  getNotificationPreferencesApi,
  getNotificationTargetsApi,
  listNotificationsApi,
  markNotificationReadApi,
  markNotificationUnreadApi,
  updateNotificationPreferencesApi,
} from '@features/notification/notification.api';

jest.mock('@services/api', () => {
  const actual = jest.requireActual('@services/api');
  return {
    ...actual,
    apiClient: jest.fn(),
  };
});

describe('notification.api', () => {
  it('lists notifications', async () => {
    const params = { page: 1, limit: 10 };
    apiClient.mockResolvedValue({ data: [] });
    await listNotificationsApi(params);
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.NOTIFICATIONS.LIST}${buildQueryString(params)}`,
      method: 'GET',
    });
  });

  it('lists notifications with default params', async () => {
    apiClient.mockResolvedValue({ data: [] });
    await listNotificationsApi();
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.NOTIFICATIONS.LIST}${buildQueryString({})}`,
      method: 'GET',
    });
  });

  it('gets a notification', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await getNotificationApi('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.NOTIFICATIONS.GET('1'),
      method: 'GET',
    });
  });

  it('marks a notification read', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await markNotificationReadApi('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.NOTIFICATIONS.MARK_READ('1'),
      method: 'POST',
    });
  });

  it('marks a notification unread', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await markNotificationUnreadApi('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.NOTIFICATIONS.MARK_UNREAD('1'),
      method: 'POST',
    });
  });

  it('fetches notification targets', async () => {
    apiClient.mockResolvedValue({ data: [] });
    await getNotificationTargetsApi();
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.NOTIFICATIONS.GET_TARGETS,
      method: 'GET',
    });
  });

  it('fetches notification preferences', async () => {
    apiClient.mockResolvedValue({ data: {} });
    await getNotificationPreferencesApi();
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.NOTIFICATIONS.GET_PREFERENCES,
      method: 'GET',
    });
  });

  it('updates notification preferences', async () => {
    const payload = { channel: 'email' };
    apiClient.mockResolvedValue({ data: payload });
    await updateNotificationPreferencesApi(payload);
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.NOTIFICATIONS.UPDATE_PREFERENCES,
      method: 'PUT',
      body: payload,
    });
  });
});
