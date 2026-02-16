/**
 * Equipment Warranty Contract API Tests
 * File: equipment-warranty-contract.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { equipmentWarrantyContractApi } from '@features/equipment-warranty-contract/equipment-warranty-contract.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('equipment-warranty-contract.api', () => {
  it('creates crud api with Equipment Warranty Contract endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.EQUIPMENT_WARRANTY_CONTRACTS);
    expect(equipmentWarrantyContractApi).toBeDefined();
  });
});
