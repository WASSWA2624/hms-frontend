/**
 * Bed API Tests
 * File: bed.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { bedApi } from '@features/bed/bed.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('bed.api', () => {
  it('creates crud api with bed endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.BEDS);
    expect(bedApi).toBeDefined();
  });
});
