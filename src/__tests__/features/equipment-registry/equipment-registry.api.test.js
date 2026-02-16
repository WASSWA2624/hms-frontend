/**
 * Equipment Registry API Tests
 * File: equipment-registry.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { equipmentRegistryApi } from '@features/equipment-registry/equipment-registry.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('equipment-registry.api', () => {
  it('creates crud api with Equipment Registry endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.EQUIPMENT_REGISTRIES);
    expect(equipmentRegistryApi).toBeDefined();
  });
});
