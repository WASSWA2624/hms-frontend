/**
 * useEquipmentSparePart Hook
 * File: useEquipmentSparePart.js
 */
import useCrud from '@hooks/useCrud';
import {
  listEquipmentSpareParts,
  getEquipmentSparePart,
  createEquipmentSparePart,
  updateEquipmentSparePart,
  deleteEquipmentSparePart
} from '@features/equipment-spare-part';

const useEquipmentSparePart = () =>
  useCrud({
    list: listEquipmentSpareParts,
    get: getEquipmentSparePart,
    create: createEquipmentSparePart,
    update: updateEquipmentSparePart,
    remove: deleteEquipmentSparePart,
  });

export default useEquipmentSparePart;
