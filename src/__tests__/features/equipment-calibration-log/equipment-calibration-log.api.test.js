/**
 * Equipment Calibration Log API Tests
 * File: equipment-calibration-log.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { equipmentCalibrationLogApi } from '@features/equipment-calibration-log/equipment-calibration-log.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('equipment-calibration-log.api', () => {
  it('creates crud api with Equipment Calibration Log endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.EQUIPMENT_CALIBRATION_LOGS);
    expect(equipmentCalibrationLogApi).toBeDefined();
  });
});
