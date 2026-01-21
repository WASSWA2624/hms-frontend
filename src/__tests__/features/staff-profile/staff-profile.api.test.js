/**
 * Staff Profile API Tests
 * File: staff-profile.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { staffProfileApi } from '@features/staff-profile/staff-profile.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('staff-profile.api', () => {
  it('creates crud api with staff profile endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.STAFF_PROFILES);
    expect(staffProfileApi).toBeDefined();
  });
});
