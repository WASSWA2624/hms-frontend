/**
 * Equipment Service Provider API Tests
 * File: equipment-service-provider.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { equipmentServiceProviderApi } from '@features/equipment-service-provider/equipment-service-provider.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('equipment-service-provider.api', () => {
  it('creates crud api with Equipment Service Provider endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.EQUIPMENT_SERVICE_PROVIDERS);
    expect(equipmentServiceProviderApi).toBeDefined();
  });
});
