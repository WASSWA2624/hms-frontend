/**
 * Breach Notification API Tests
 * File: breach-notification.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';
import { breachNotificationApi } from '@features/breach-notification/breach-notification.api';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
  buildQueryString: jest.fn(() => '?page=1'),
}));

describe('breach-notification.api', () => {
  it('lists breach notifications with query params', async () => {
    apiClient.mockResolvedValue({ data: [] });

    await breachNotificationApi.list({ page: 1 });

    expect(buildQueryString).toHaveBeenCalledWith({ page: 1 });
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.BREACH_NOTIFICATIONS.LIST}?page=1`,
      method: 'GET',
    });
  });

  it('gets a breach notification by id', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });

    await breachNotificationApi.get('1');

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.BREACH_NOTIFICATIONS.GET('1'),
      method: 'GET',
    });
  });

  it('creates a breach notification', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });

    await breachNotificationApi.create({ title: 'Incident' });

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.BREACH_NOTIFICATIONS.CREATE,
      method: 'POST',
      body: { title: 'Incident' },
    });
  });

  it('updates a breach notification', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });

    await breachNotificationApi.update('1', { status: 'OPEN' });

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.BREACH_NOTIFICATIONS.UPDATE('1'),
      method: 'PUT',
      body: { status: 'OPEN' },
    });
  });

  it('resolves a breach notification', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });

    await breachNotificationApi.resolve('1', { resolution_notes: 'Resolved' });

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.BREACH_NOTIFICATIONS.RESOLVE('1'),
      method: 'POST',
      body: { resolution_notes: 'Resolved' },
    });
  });
});
