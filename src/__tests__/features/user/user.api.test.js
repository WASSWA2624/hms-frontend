/**
 * User API Tests
 * File: user.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { userApi } from '@features/user/user.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('user.api', () => {
  it('creates crud api with user endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.USERS);
    expect(userApi).toBeDefined();
  });
});
