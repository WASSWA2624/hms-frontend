/**
 * Equipment Location History Usecase Tests
 * File: equipment-location-history.usecase.test.js
 */
import {
  listEquipmentLocationHistories,
  getEquipmentLocationHistory,
  createEquipmentLocationHistory,
  updateEquipmentLocationHistory,
  deleteEquipmentLocationHistory,
} from '@features/equipment-location-history';
import { equipmentLocationHistoryApi } from '@features/equipment-location-history/equipment-location-history.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/equipment-location-history/equipment-location-history.api', () => ({
  equipmentLocationHistoryApi: {
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

describe('equipment-location-history.usecase', () => {
  beforeEach(() => {
    equipmentLocationHistoryApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    equipmentLocationHistoryApi.get.mockResolvedValue({ data: { id: '1' } });
    equipmentLocationHistoryApi.create.mockResolvedValue({ data: { id: '1' } });
    equipmentLocationHistoryApi.update.mockResolvedValue({ data: { id: '1' } });
    equipmentLocationHistoryApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listEquipmentLocationHistories,
      get: getEquipmentLocationHistory,
      create: createEquipmentLocationHistory,
      update: updateEquipmentLocationHistory,
      remove: deleteEquipmentLocationHistory,
    },
    { queueRequestIfOffline }
  );
});
