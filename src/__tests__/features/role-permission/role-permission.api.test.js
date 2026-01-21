/**
 * Role Permission API Tests
 * File: role-permission.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { rolePermissionApi } from '@features/role-permission/role-permission.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('role-permission.api', () => {
  it('creates crud api with role permission endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.ROLE_PERMISSIONS);
    expect(rolePermissionApi).toBeDefined();
  });
});
