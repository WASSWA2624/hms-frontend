/**
 * Staff Availability API Tests
 * File: staff-availability.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { staffAvailabilityApi } from '@features/staff-availability/staff-availability.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('staff-availability.api', () => {
  it('creates crud api with staff availability endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.STAFF_AVAILABILITIES);
    expect(staffAvailabilityApi).toBeDefined();
  });
});

