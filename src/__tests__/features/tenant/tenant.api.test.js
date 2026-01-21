/**
 * Tenant API Tests
 * File: tenant.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { tenantApi } from '@features/tenant/tenant.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('tenant.api', () => {
  it('creates crud api with tenant endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.TENANTS);
    expect(tenantApi).toBeDefined();
  });
});
