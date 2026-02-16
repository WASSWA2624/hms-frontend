/**
 * Equipment Spare Part API Tests
 * File: equipment-spare-part.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { equipmentSparePartApi } from '@features/equipment-spare-part/equipment-spare-part.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('equipment-spare-part.api', () => {
  it('creates crud api with Equipment Spare Part endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.EQUIPMENT_SPARE_PARTS);
    expect(equipmentSparePartApi).toBeDefined();
  });
});
