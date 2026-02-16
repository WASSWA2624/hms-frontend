/**
 * Equipment Downtime Log API Tests
 * File: equipment-downtime-log.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { equipmentDowntimeLogApi } from '@features/equipment-downtime-log/equipment-downtime-log.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('equipment-downtime-log.api', () => {
  it('creates crud api with Equipment Downtime Log endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.EQUIPMENT_DOWNTIME_LOGS);
    expect(equipmentDowntimeLogApi).toBeDefined();
  });
});
