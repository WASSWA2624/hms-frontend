/**
 * Equipment Calibration Log Usecase Tests
 * File: equipment-calibration-log.usecase.test.js
 */
import {
  listEquipmentCalibrationLogs,
  getEquipmentCalibrationLog,
  createEquipmentCalibrationLog,
  updateEquipmentCalibrationLog,
  deleteEquipmentCalibrationLog,
} from '@features/equipment-calibration-log';
import { equipmentCalibrationLogApi } from '@features/equipment-calibration-log/equipment-calibration-log.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/equipment-calibration-log/equipment-calibration-log.api', () => ({
  equipmentCalibrationLogApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('equipment-calibration-log.usecase', () => {
  beforeEach(() => {
    equipmentCalibrationLogApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    equipmentCalibrationLogApi.get.mockResolvedValue({ data: { id: '1' } });
    equipmentCalibrationLogApi.create.mockResolvedValue({ data: { id: '1' } });
    equipmentCalibrationLogApi.update.mockResolvedValue({ data: { id: '1' } });
    equipmentCalibrationLogApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listEquipmentCalibrationLogs,
      get: getEquipmentCalibrationLog,
      create: createEquipmentCalibrationLog,
      update: updateEquipmentCalibrationLog,
      remove: deleteEquipmentCalibrationLog,
    },
    { queueRequestIfOffline }
  );
});
