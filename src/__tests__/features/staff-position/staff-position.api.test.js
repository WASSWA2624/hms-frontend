/**
 * Staff Position API Tests
 * File: staff-position.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { staffPositionApi } from '@features/staff-position/staff-position.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('staff-position.api', () => {
  it('creates crud api with staff position endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.STAFF_POSITIONS);
    expect(staffPositionApi).toBeDefined();
  });
});

