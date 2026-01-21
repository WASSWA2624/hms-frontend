/**
 * Branch API Tests
 * File: branch.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { branchApi } from '@features/branch/branch.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('branch.api', () => {
  it('creates crud api with branch endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.BRANCHES);
    expect(branchApi).toBeDefined();
  });
});
