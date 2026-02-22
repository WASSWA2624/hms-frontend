/**
 * Webhook Subscription API Tests
 * File: webhook-subscription.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { webhookSubscriptionApi } from '@features/webhook-subscription/webhook-subscription.api';

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

describe('webhook-subscription.api', () => {
  it('creates crud api with webhook subscription endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.WEBHOOK_SUBSCRIPTIONS);
    expect(webhookSubscriptionApi).toBeDefined();
  });

  it('posts webhook subscription replay action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await webhookSubscriptionApi.replay('1', { delivery_id: 'd-1' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.WEBHOOK_SUBSCRIPTIONS.REPLAY('1'),
      method: 'POST',
      body: { delivery_id: 'd-1' },
    });
  });

  it('posts webhook subscription replay action with default payload', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await webhookSubscriptionApi.replay('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.WEBHOOK_SUBSCRIPTIONS.REPLAY('1'),
      method: 'POST',
      body: {},
    });
  });
});
