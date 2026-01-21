/**
 * API Key Permission API Tests
 * File: api-key-permission.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { apiKeyPermissionApi } from '@features/api-key-permission/api-key-permission.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('api-key-permission.api', () => {
  it('creates crud api with api key permission endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.API_KEY_PERMISSIONS);
    expect(apiKeyPermissionApi).toBeDefined();
  });
});
