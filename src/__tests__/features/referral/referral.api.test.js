/**
 * Referral API Tests
 * File: referral.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { referralApi } from '@features/referral/referral.api';

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

describe('referral.api', () => {
  it('creates crud api with referral endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.REFERRALS);
    expect(referralApi).toBeDefined();
  });

  it('posts referral redeem action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await referralApi.redeem('1', { notes: 'Redeemed at destination' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.REFERRALS.REDEEM('1'),
      method: 'POST',
      body: { notes: 'Redeemed at destination' },
    });
  });

  it('posts referral redeem action with default payload', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await referralApi.redeem('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.REFERRALS.REDEEM('1'),
      method: 'POST',
      body: {},
    });
  });
});
