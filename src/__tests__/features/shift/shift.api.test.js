/**
 * Shift API Tests
 * File: shift.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { shiftApi } from '@features/shift/shift.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('shift.api', () => {
  it('creates crud api with shift endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.SHIFTS);
    expect(shiftApi).toBeDefined();
  });
});
