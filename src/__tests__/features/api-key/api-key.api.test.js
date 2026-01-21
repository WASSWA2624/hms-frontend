/**
 * API Key API Tests
 * File: api-key.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { apiKeyApi } from '@features/api-key/api-key.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('api-key.api', () => {
  it('creates crud api with api key endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.API_KEYS);
    expect(apiKeyApi).toBeDefined();
  });
});
