/**
 * Equipment Maintenance Plan API Tests
 * File: equipment-maintenance-plan.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { equipmentMaintenancePlanApi } from '@features/equipment-maintenance-plan/equipment-maintenance-plan.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('equipment-maintenance-plan.api', () => {
  it('creates crud api with Equipment Maintenance Plan endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.EQUIPMENT_MAINTENANCE_PLANS);
    expect(equipmentMaintenancePlanApi).toBeDefined();
  });
});
