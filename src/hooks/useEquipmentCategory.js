/**
 * useEquipmentCategory Hook
 * File: useEquipmentCategory.js
 */
import useCrud from '@hooks/useCrud';
import {
  listEquipmentCategories,
  getEquipmentCategory,
  createEquipmentCategory,
  updateEquipmentCategory,
  deleteEquipmentCategory
} from '@features/equipment-category';

const useEquipmentCategory = () =>
  useCrud({
    list: listEquipmentCategories,
    get: getEquipmentCategory,
    create: createEquipmentCategory,
    update: updateEquipmentCategory,
    remove: deleteEquipmentCategory,
  });

export default useEquipmentCategory;
