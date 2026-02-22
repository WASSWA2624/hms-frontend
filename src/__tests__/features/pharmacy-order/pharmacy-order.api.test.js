/**
 * Pharmacy Order API Tests
 * File: pharmacy-order.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { pharmacyOrderApi } from '@features/pharmacy-order/pharmacy-order.api';

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

describe('pharmacy-order.api', () => {
  it('creates crud api with pharmacy order endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.PHARMACY_ORDERS);
    expect(pharmacyOrderApi).toBeDefined();
  });

  it('posts pharmacy order dispense action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'DISPENSED' } });
    await pharmacyOrderApi.dispense('1', { notes: 'Dispensed by pharmacy' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.PHARMACY_ORDERS.DISPENSE('1'),
      method: 'POST',
      body: { notes: 'Dispensed by pharmacy' },
    });
  });

  it('posts pharmacy order dispense action with default payload', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'DISPENSED' } });
    await pharmacyOrderApi.dispense('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.PHARMACY_ORDERS.DISPENSE('1'),
      method: 'POST',
      body: {},
    });
  });
});
