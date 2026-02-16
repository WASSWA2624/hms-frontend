/**
 * Equipment Safety Test Log API Tests
 * File: equipment-safety-test-log.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { equipmentSafetyTestLogApi } from '@features/equipment-safety-test-log/equipment-safety-test-log.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('equipment-safety-test-log.api', () => {
  it('creates crud api with Equipment Safety Test Log endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.EQUIPMENT_SAFETY_TEST_LOGS);
    expect(equipmentSafetyTestLogApi).toBeDefined();
  });
});
