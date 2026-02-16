/**
 * Equipment Safety Test Log Usecase Tests
 * File: equipment-safety-test-log.usecase.test.js
 */
import {
  listEquipmentSafetyTestLogs,
  getEquipmentSafetyTestLog,
  createEquipmentSafetyTestLog,
  updateEquipmentSafetyTestLog,
  deleteEquipmentSafetyTestLog,
} from '@features/equipment-safety-test-log';
import { equipmentSafetyTestLogApi } from '@features/equipment-safety-test-log/equipment-safety-test-log.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/equipment-safety-test-log/equipment-safety-test-log.api', () => ({
  equipmentSafetyTestLogApi: {
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

describe('equipment-safety-test-log.usecase', () => {
  beforeEach(() => {
    equipmentSafetyTestLogApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    equipmentSafetyTestLogApi.get.mockResolvedValue({ data: { id: '1' } });
    equipmentSafetyTestLogApi.create.mockResolvedValue({ data: { id: '1' } });
    equipmentSafetyTestLogApi.update.mockResolvedValue({ data: { id: '1' } });
    equipmentSafetyTestLogApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listEquipmentSafetyTestLogs,
      get: getEquipmentSafetyTestLog,
      create: createEquipmentSafetyTestLog,
      update: updateEquipmentSafetyTestLog,
      remove: deleteEquipmentSafetyTestLog,
    },
    { queueRequestIfOffline }
  );
});
