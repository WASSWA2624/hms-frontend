/**
 * Ward API Tests
 * File: ward.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { wardApi, getWardBedsApi } from '@features/ward/ward.api';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('ward.api', () => {
  it('creates crud api with ward endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.WARDS);
    expect(wardApi).toBeDefined();
  });

  it('fetches ward beds', async () => {
    apiClient.mockResolvedValue({ data: [] });
    await getWardBedsApi('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.WARDS.GET_BEDS('1'),
      method: 'GET',
    });
  });
});
