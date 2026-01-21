/**
 * Staff Assignment API Tests
 * File: staff-assignment.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { staffAssignmentApi } from '@features/staff-assignment/staff-assignment.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('staff-assignment.api', () => {
  it('creates crud api with staff assignment endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.STAFF_ASSIGNMENTS);
    expect(staffAssignmentApi).toBeDefined();
  });
});
