/**
 * Department API Tests
 * File: department.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { departmentApi, getDepartmentUnitsApi } from '@features/department/department.api';

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

describe('department.api', () => {
  it('creates crud api with department endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.DEPARTMENTS);
    expect(departmentApi).toBeDefined();
  });

  it('fetches department units', async () => {
    apiClient.mockResolvedValue({ data: [] });
    await getDepartmentUnitsApi('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.DEPARTMENTS.GET_UNITS('1'),
      method: 'GET',
    });
  });
});
