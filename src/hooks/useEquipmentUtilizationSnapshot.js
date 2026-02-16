/**
 * useEquipmentUtilizationSnapshot Hook
 * File: useEquipmentUtilizationSnapshot.js
 */
import useCrud from '@hooks/useCrud';
import {
  listEquipmentUtilizationSnapshots,
  getEquipmentUtilizationSnapshot,
  createEquipmentUtilizationSnapshot,
  updateEquipmentUtilizationSnapshot,
  deleteEquipmentUtilizationSnapshot
} from '@features/equipment-utilization-snapshot';

const useEquipmentUtilizationSnapshot = () =>
  useCrud({
    list: listEquipmentUtilizationSnapshots,
    get: getEquipmentUtilizationSnapshot,
    create: createEquipmentUtilizationSnapshot,
    update: updateEquipmentUtilizationSnapshot,
    remove: deleteEquipmentUtilizationSnapshot,
  });

export default useEquipmentUtilizationSnapshot;
