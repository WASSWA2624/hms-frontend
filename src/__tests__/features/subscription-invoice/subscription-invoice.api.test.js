/**
 * Subscription Invoice API Tests
 * File: subscription-invoice.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { subscriptionInvoiceApi } from '@features/subscription-invoice/subscription-invoice.api';

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

describe('subscription-invoice.api', () => {
  it('creates crud api with subscription invoice endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.SUBSCRIPTION_INVOICES);
    expect(subscriptionInvoiceApi).toBeDefined();
  });

  it('posts invoice collect action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await subscriptionInvoiceApi.collect('1', { payment_method: 'CASH' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.SUBSCRIPTION_INVOICES.COLLECT('1'),
      method: 'POST',
      body: { payment_method: 'CASH' },
    });
  });

  it('posts invoice retry action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1' } });
    await subscriptionInvoiceApi.retry('1', { retry_reason: 'network' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.SUBSCRIPTION_INVOICES.RETRY('1'),
      method: 'POST',
      body: { retry_reason: 'network' },
    });
  });
});
