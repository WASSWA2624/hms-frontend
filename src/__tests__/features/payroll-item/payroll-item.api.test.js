/**
 * Payroll Item API Tests
 * File: payroll-item.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { payrollItemApi } from '@features/payroll-item/payroll-item.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('payroll-item.api', () => {
  it('creates crud api with payroll item endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.PAYROLL_ITEMS);
    expect(payrollItemApi).toBeDefined();
  });
});
