/**
 * Address API Tests
 * File: address.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { addressApi } from '@features/address/address.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('address.api', () => {
  it('creates crud api with address endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.ADDRESSES);
    expect(addressApi).toBeDefined();
  });
});
