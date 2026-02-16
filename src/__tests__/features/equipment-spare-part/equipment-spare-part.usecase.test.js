/**
 * Equipment Spare Part Usecase Tests
 * File: equipment-spare-part.usecase.test.js
 */
import {
  listEquipmentSpareParts,
  getEquipmentSparePart,
  createEquipmentSparePart,
  updateEquipmentSparePart,
  deleteEquipmentSparePart,
} from '@features/equipment-spare-part';
import { equipmentSparePartApi } from '@features/equipment-spare-part/equipment-spare-part.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/equipment-spare-part/equipment-spare-part.api', () => ({
  equipmentSparePartApi: {
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

describe('equipment-spare-part.usecase', () => {
  beforeEach(() => {
    equipmentSparePartApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    equipmentSparePartApi.get.mockResolvedValue({ data: { id: '1' } });
    equipmentSparePartApi.create.mockResolvedValue({ data: { id: '1' } });
    equipmentSparePartApi.update.mockResolvedValue({ data: { id: '1' } });
    equipmentSparePartApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listEquipmentSpareParts,
      get: getEquipmentSparePart,
      create: createEquipmentSparePart,
      update: updateEquipmentSparePart,
      remove: deleteEquipmentSparePart,
    },
    { queueRequestIfOffline }
  );
});
