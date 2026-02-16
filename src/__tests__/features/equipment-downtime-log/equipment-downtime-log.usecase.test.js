/**
 * Equipment Downtime Log Usecase Tests
 * File: equipment-downtime-log.usecase.test.js
 */
import {
  listEquipmentDowntimeLogs,
  getEquipmentDowntimeLog,
  createEquipmentDowntimeLog,
  updateEquipmentDowntimeLog,
  deleteEquipmentDowntimeLog,
} from '@features/equipment-downtime-log';
import { equipmentDowntimeLogApi } from '@features/equipment-downtime-log/equipment-downtime-log.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/equipment-downtime-log/equipment-downtime-log.api', () => ({
  equipmentDowntimeLogApi: {
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

describe('equipment-downtime-log.usecase', () => {
  beforeEach(() => {
    equipmentDowntimeLogApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    equipmentDowntimeLogApi.get.mockResolvedValue({ data: { id: '1' } });
    equipmentDowntimeLogApi.create.mockResolvedValue({ data: { id: '1' } });
    equipmentDowntimeLogApi.update.mockResolvedValue({ data: { id: '1' } });
    equipmentDowntimeLogApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listEquipmentDowntimeLogs,
      get: getEquipmentDowntimeLog,
      create: createEquipmentDowntimeLog,
      update: updateEquipmentDowntimeLog,
      remove: deleteEquipmentDowntimeLog,
    },
    { queueRequestIfOffline }
  );
});
