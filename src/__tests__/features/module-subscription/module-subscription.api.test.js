/**
 * Module Subscription API Tests
 * File: module-subscription.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { moduleSubscriptionApi } from '@features/module-subscription/module-subscription.api';

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

describe('module-subscription.api', () => {
  it('creates crud api with module subscription endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.MODULE_SUBSCRIPTIONS);
    expect(moduleSubscriptionApi).toBeDefined();
  });

  it('posts module subscription activate action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await moduleSubscriptionApi.activate('1', { reason: 'enable module' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.MODULE_SUBSCRIPTIONS.ACTIVATE('1'),
      method: 'POST',
      body: { reason: 'enable module' },
    });
  });

  it('posts module subscription deactivate action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await moduleSubscriptionApi.deactivate('1', { reason: 'disable module' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.MODULE_SUBSCRIPTIONS.DEACTIVATE('1'),
      method: 'POST',
      body: { reason: 'disable module' },
    });
  });

  it('gets module subscription eligibility check', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await moduleSubscriptionApi.checkEligibility('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.MODULE_SUBSCRIPTIONS.ELIGIBILITY_CHECK('1'),
      method: 'GET',
    });
  });
});
