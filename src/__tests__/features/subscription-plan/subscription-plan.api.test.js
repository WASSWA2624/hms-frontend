/**
 * Subscription Plan API Tests
 * File: subscription-plan.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { subscriptionPlanApi } from '@features/subscription-plan/subscription-plan.api';

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

describe('subscription-plan.api', () => {
  it('creates crud api with subscription plan endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.SUBSCRIPTION_PLANS);
    expect(subscriptionPlanApi).toBeDefined();
  });

  it('gets subscription plan entitlements', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await subscriptionPlanApi.getEntitlements('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.SUBSCRIPTION_PLANS.ENTITLEMENTS('1'),
      method: 'GET',
    });
  });

  it('gets subscription plan add-on eligibility', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await subscriptionPlanApi.getAddOnEligibility('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.SUBSCRIPTION_PLANS.ADD_ON_ELIGIBILITY('1'),
      method: 'GET',
    });
  });
});
