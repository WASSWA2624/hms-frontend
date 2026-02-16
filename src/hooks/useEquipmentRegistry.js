/**
 * useEquipmentRegistry Hook
 * File: useEquipmentRegistry.js
 */
import useCrud from '@hooks/useCrud';
import {
  listEquipmentRegistries,
  getEquipmentRegistry,
  createEquipmentRegistry,
  updateEquipmentRegistry,
  deleteEquipmentRegistry
} from '@features/equipment-registry';

const useEquipmentRegistry = () =>
  useCrud({
    list: listEquipmentRegistries,
    get: getEquipmentRegistry,
    create: createEquipmentRegistry,
    update: updateEquipmentRegistry,
    remove: deleteEquipmentRegistry,
  });

export default useEquipmentRegistry;
