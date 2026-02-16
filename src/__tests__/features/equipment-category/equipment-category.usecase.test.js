/**
 * Equipment Category Usecase Tests
 * File: equipment-category.usecase.test.js
 */
import {
  listEquipmentCategories,
  getEquipmentCategory,
  createEquipmentCategory,
  updateEquipmentCategory,
  deleteEquipmentCategory,
} from '@features/equipment-category';
import { equipmentCategoryApi } from '@features/equipment-category/equipment-category.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/equipment-category/equipment-category.api', () => ({
  equipmentCategoryApi: {
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

describe('equipment-category.usecase', () => {
  beforeEach(() => {
    equipmentCategoryApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    equipmentCategoryApi.get.mockResolvedValue({ data: { id: '1' } });
    equipmentCategoryApi.create.mockResolvedValue({ data: { id: '1' } });
    equipmentCategoryApi.update.mockResolvedValue({ data: { id: '1' } });
    equipmentCategoryApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listEquipmentCategories,
      get: getEquipmentCategory,
      create: createEquipmentCategory,
      update: updateEquipmentCategory,
      remove: deleteEquipmentCategory,
    },
    { queueRequestIfOffline }
  );
});
