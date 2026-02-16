/**
 * useEquipmentLocationHistory Hook
 * File: useEquipmentLocationHistory.js
 */
import useCrud from '@hooks/useCrud';
import {
  listEquipmentLocationHistories,
  getEquipmentLocationHistory,
  createEquipmentLocationHistory,
  updateEquipmentLocationHistory,
  deleteEquipmentLocationHistory
} from '@features/equipment-location-history';

const useEquipmentLocationHistory = () =>
  useCrud({
    list: listEquipmentLocationHistories,
    get: getEquipmentLocationHistory,
    create: createEquipmentLocationHistory,
    update: updateEquipmentLocationHistory,
    remove: deleteEquipmentLocationHistory,
  });

export default useEquipmentLocationHistory;
