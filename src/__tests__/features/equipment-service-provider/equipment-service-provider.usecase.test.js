/**
 * Equipment Service Provider Usecase Tests
 * File: equipment-service-provider.usecase.test.js
 */
import {
  listEquipmentServiceProviders,
  getEquipmentServiceProvider,
  createEquipmentServiceProvider,
  updateEquipmentServiceProvider,
  deleteEquipmentServiceProvider,
} from '@features/equipment-service-provider';
import { equipmentServiceProviderApi } from '@features/equipment-service-provider/equipment-service-provider.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/equipment-service-provider/equipment-service-provider.api', () => ({
  equipmentServiceProviderApi: {
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

describe('equipment-service-provider.usecase', () => {
  beforeEach(() => {
    equipmentServiceProviderApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    equipmentServiceProviderApi.get.mockResolvedValue({ data: { id: '1' } });
    equipmentServiceProviderApi.create.mockResolvedValue({ data: { id: '1' } });
    equipmentServiceProviderApi.update.mockResolvedValue({ data: { id: '1' } });
    equipmentServiceProviderApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listEquipmentServiceProviders,
      get: getEquipmentServiceProvider,
      create: createEquipmentServiceProvider,
      update: updateEquipmentServiceProvider,
      remove: deleteEquipmentServiceProvider,
    },
    { queueRequestIfOffline }
  );
});
