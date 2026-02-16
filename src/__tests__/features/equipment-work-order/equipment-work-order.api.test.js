/**
 * Equipment Work Order API Tests
 * File: equipment-work-order.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { equipmentWorkOrderApi } from '@features/equipment-work-order/equipment-work-order.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('equipment-work-order.api', () => {
  it('creates crud api with Equipment Work Order endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.EQUIPMENT_WORK_ORDERS);
    expect(equipmentWorkOrderApi).toBeDefined();
  });
});
