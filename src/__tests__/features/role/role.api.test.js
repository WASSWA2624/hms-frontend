/**
 * Role API Tests
 * File: role.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { roleApi } from '@features/role/role.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('role.api', () => {
  it('creates crud api with role endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.ROLES);
    expect(roleApi).toBeDefined();
  });
});
