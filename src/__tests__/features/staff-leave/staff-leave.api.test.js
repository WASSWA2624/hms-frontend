/**
 * Staff Leave API Tests
 * File: staff-leave.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { staffLeaveApi } from '@features/staff-leave/staff-leave.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('staff-leave.api', () => {
  it('creates crud api with staff leave endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.STAFF_LEAVES);
    expect(staffLeaveApi).toBeDefined();
  });
});
