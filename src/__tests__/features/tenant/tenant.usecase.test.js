/**
 * Tenant Usecase Tests
 * File: tenant.usecase.test.js
 */
import { listTenants, getTenant, createTenant, updateTenant, deleteTenant } from '@features/tenant';
import { tenantApi } from '@features/tenant/tenant.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/tenant/tenant.api', () => ({
  tenantApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('tenant.usecase', () => {
  beforeEach(() => {
    tenantApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    tenantApi.get.mockResolvedValue({ data: { id: '1' } });
    tenantApi.create.mockResolvedValue({ data: { id: '1' } });
    tenantApi.update.mockResolvedValue({ data: { id: '1' } });
    tenantApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listTenants,
      get: getTenant,
      create: createTenant,
      update: updateTenant,
      remove: deleteTenant,
    },
    { queueRequestIfOffline }
  );
});
