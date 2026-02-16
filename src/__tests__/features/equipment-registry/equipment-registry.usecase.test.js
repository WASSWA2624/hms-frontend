/**
 * Equipment Registry Usecase Tests
 * File: equipment-registry.usecase.test.js
 */
import {
  listEquipmentRegistries,
  getEquipmentRegistry,
  createEquipmentRegistry,
  updateEquipmentRegistry,
  deleteEquipmentRegistry,
} from '@features/equipment-registry';
import { equipmentRegistryApi } from '@features/equipment-registry/equipment-registry.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/equipment-registry/equipment-registry.api', () => ({
  equipmentRegistryApi: {
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

describe('equipment-registry.usecase', () => {
  beforeEach(() => {
    equipmentRegistryApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    equipmentRegistryApi.get.mockResolvedValue({ data: { id: '1' } });
    equipmentRegistryApi.create.mockResolvedValue({ data: { id: '1' } });
    equipmentRegistryApi.update.mockResolvedValue({ data: { id: '1' } });
    equipmentRegistryApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listEquipmentRegistries,
      get: getEquipmentRegistry,
      create: createEquipmentRegistry,
      update: updateEquipmentRegistry,
      remove: deleteEquipmentRegistry,
    },
    { queueRequestIfOffline }
  );
});
