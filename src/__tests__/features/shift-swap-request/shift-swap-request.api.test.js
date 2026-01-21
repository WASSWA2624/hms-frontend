/**
 * Shift Swap Request API Tests
 * File: shift-swap-request.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { shiftSwapRequestApi } from '@features/shift-swap-request/shift-swap-request.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('shift-swap-request.api', () => {
  it('creates crud api with shift swap request endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.SHIFT_SWAP_REQUESTS);
    expect(shiftSwapRequestApi).toBeDefined();
  });
});
