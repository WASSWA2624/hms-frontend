/**
 * Facility API Tests
 * File: facility.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { facilityApi, getFacilityBranchesApi } from '@features/facility/facility.api';

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

describe('facility.api', () => {
  it('creates crud api with facility endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.FACILITIES);
    expect(facilityApi).toBeDefined();
  });

  it('fetches facility branches', async () => {
    apiClient.mockResolvedValue({ data: [] });
    await getFacilityBranchesApi('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.FACILITIES.GET_BRANCHES('1'),
      method: 'GET',
    });
  });
});
