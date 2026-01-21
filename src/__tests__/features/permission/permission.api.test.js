/**
 * Permission API Tests
 * File: permission.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { permissionApi } from '@features/permission/permission.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('permission.api', () => {
  it('creates crud api with permission endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.PERMISSIONS);
    expect(permissionApi).toBeDefined();
  });
});
