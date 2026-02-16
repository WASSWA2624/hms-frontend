/**
 * Equipment Utilization Snapshot Usecase Tests
 * File: equipment-utilization-snapshot.usecase.test.js
 */
import {
  listEquipmentUtilizationSnapshots,
  getEquipmentUtilizationSnapshot,
  createEquipmentUtilizationSnapshot,
  updateEquipmentUtilizationSnapshot,
  deleteEquipmentUtilizationSnapshot,
} from '@features/equipment-utilization-snapshot';
import { equipmentUtilizationSnapshotApi } from '@features/equipment-utilization-snapshot/equipment-utilization-snapshot.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/equipment-utilization-snapshot/equipment-utilization-snapshot.api', () => ({
  equipmentUtilizationSnapshotApi: {
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

describe('equipment-utilization-snapshot.usecase', () => {
  beforeEach(() => {
    equipmentUtilizationSnapshotApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    equipmentUtilizationSnapshotApi.get.mockResolvedValue({ data: { id: '1' } });
    equipmentUtilizationSnapshotApi.create.mockResolvedValue({ data: { id: '1' } });
    equipmentUtilizationSnapshotApi.update.mockResolvedValue({ data: { id: '1' } });
    equipmentUtilizationSnapshotApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listEquipmentUtilizationSnapshots,
      get: getEquipmentUtilizationSnapshot,
      create: createEquipmentUtilizationSnapshot,
      update: updateEquipmentUtilizationSnapshot,
      remove: deleteEquipmentUtilizationSnapshot,
    },
    { queueRequestIfOffline }
  );
});
