/**
 * Subscription API Tests
 * File: subscription.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString, createCrudApi } from '@services/api';
import { subscriptionApi } from '@features/subscription/subscription.api';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
  buildQueryString: jest.fn((params = {}) => {
    const entries = Object.entries(params);
    if (!entries.length) return '';
    const query = new URLSearchParams(entries).toString();
    return query ? `?${query}` : '';
  }),
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('subscription.api', () => {
  it('creates crud api with subscription endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.SUBSCRIPTIONS);
    expect(subscriptionApi).toBeDefined();
  });

  it('posts subscription upgrade action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await subscriptionApi.upgrade('1', { target_plan_id: 'plan-2' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.SUBSCRIPTIONS.UPGRADE('1'),
      method: 'POST',
      body: { target_plan_id: 'plan-2' },
    });
  });

  it('posts subscription downgrade action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await subscriptionApi.downgrade('1', { target_plan_id: 'plan-1' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.SUBSCRIPTIONS.DOWNGRADE('1'),
      method: 'POST',
      body: { target_plan_id: 'plan-1' },
    });
  });

  it('posts subscription renew action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await subscriptionApi.renew('1', { reason: 'renewal' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.SUBSCRIPTIONS.RENEW('1'),
      method: 'POST',
      body: { reason: 'renewal' },
    });
  });

  it('gets proration preview', async () => {
    const params = { target_plan_id: 'plan-2' };
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await subscriptionApi.getProrationPreview('1', params);
    expect(buildQueryString).toHaveBeenCalledWith(params);
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.SUBSCRIPTIONS.PRORATION_PREVIEW('1')}${buildQueryString(params)}`,
      method: 'GET',
    });
  });

  it('gets usage summary', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await subscriptionApi.getUsageSummary('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.SUBSCRIPTIONS.USAGE_SUMMARY('1'),
      method: 'GET',
    });
  });

  it('gets fit check', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await subscriptionApi.getFitCheck('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.SUBSCRIPTIONS.FIT_CHECK('1'),
      method: 'GET',
    });
  });

  it('gets upgrade recommendation', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await subscriptionApi.getUpgradeRecommendation('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.SUBSCRIPTIONS.UPGRADE_RECOMMENDATION('1'),
      method: 'GET',
    });
  });
});
