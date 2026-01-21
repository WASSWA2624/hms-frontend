/**
 * Shift Assignment API Tests
 * File: shift-assignment.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { shiftAssignmentApi } from '@features/shift-assignment/shift-assignment.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('shift-assignment.api', () => {
  it('creates crud api with shift assignment endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.SHIFT_ASSIGNMENTS);
    expect(shiftAssignmentApi).toBeDefined();
  });
});
