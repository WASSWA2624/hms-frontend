/**
 * Equipment Location History API Tests
 * File: equipment-location-history.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { equipmentLocationHistoryApi } from '@features/equipment-location-history/equipment-location-history.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('equipment-location-history.api', () => {
  it('creates crud api with Equipment Location History endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.EQUIPMENT_LOCATION_HISTORIES);
    expect(equipmentLocationHistoryApi).toBeDefined();
  });
});
