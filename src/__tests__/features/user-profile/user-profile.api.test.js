/**
 * User Profile API Tests
 * File: user-profile.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { userProfileApi } from '@features/user-profile/user-profile.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('user-profile.api', () => {
  it('creates crud api with user profile endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.USER_PROFILES);
    expect(userProfileApi).toBeDefined();
  });
});
