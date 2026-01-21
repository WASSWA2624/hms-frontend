/**
 * Payroll Run API Tests
 * File: payroll-run.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { payrollRunApi } from '@features/payroll-run/payroll-run.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('payroll-run.api', () => {
  it('creates crud api with payroll run endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.PAYROLL_RUNS);
    expect(payrollRunApi).toBeDefined();
  });
});
