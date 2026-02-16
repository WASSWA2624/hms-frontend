/**
 * Equipment Warranty Contract Usecase Tests
 * File: equipment-warranty-contract.usecase.test.js
 */
import {
  listEquipmentWarrantyContracts,
  getEquipmentWarrantyContract,
  createEquipmentWarrantyContract,
  updateEquipmentWarrantyContract,
  deleteEquipmentWarrantyContract,
} from '@features/equipment-warranty-contract';
import { equipmentWarrantyContractApi } from '@features/equipment-warranty-contract/equipment-warranty-contract.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/equipment-warranty-contract/equipment-warranty-contract.api', () => ({
  equipmentWarrantyContractApi: {
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

describe('equipment-warranty-contract.usecase', () => {
  beforeEach(() => {
    equipmentWarrantyContractApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    equipmentWarrantyContractApi.get.mockResolvedValue({ data: { id: '1' } });
    equipmentWarrantyContractApi.create.mockResolvedValue({ data: { id: '1' } });
    equipmentWarrantyContractApi.update.mockResolvedValue({ data: { id: '1' } });
    equipmentWarrantyContractApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listEquipmentWarrantyContracts,
      get: getEquipmentWarrantyContract,
      create: createEquipmentWarrantyContract,
      update: updateEquipmentWarrantyContract,
      remove: deleteEquipmentWarrantyContract,
    },
    { queueRequestIfOffline }
  );
});
