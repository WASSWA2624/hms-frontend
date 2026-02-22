/**
 * Payment API Tests
 * File: payment.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { paymentApi } from '@features/payment/payment.api';

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

describe('payment.api', () => {
  it('creates crud api with payment endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.PAYMENTS);
    expect(paymentApi).toBeDefined();
  });

  it('posts payment reconcile action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'COMPLETED' } });

    await paymentApi.reconcile('1', { status: 'COMPLETED' });

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.PAYMENTS.RECONCILE('1'),
      method: 'POST',
      body: { status: 'COMPLETED' },
    });
  });

  it('posts payment reconcile action with default payload', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'COMPLETED' } });

    await paymentApi.reconcile('1');

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.PAYMENTS.RECONCILE('1'),
      method: 'POST',
      body: {},
    });
  });

  it('gets payment channel breakdown action', async () => {
    apiClient.mockResolvedValue({ data: { channels: [] } });

    await paymentApi.getChannelBreakdown('1');

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.PAYMENTS.CHANNEL_BREAKDOWN('1'),
      method: 'GET',
    });
  });
});
