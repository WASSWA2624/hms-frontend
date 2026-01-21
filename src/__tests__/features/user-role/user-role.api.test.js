/**
 * User Role API Tests
 * File: user-role.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { userRoleApi } from '@features/user-role/user-role.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('user-role.api', () => {
  it('creates crud api with user role endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.USER_ROLES);
    expect(userRoleApi).toBeDefined();
  });
});
