/**
 * useEquipmentDowntimeLog Hook
 * File: useEquipmentDowntimeLog.js
 */
import useCrud from '@hooks/useCrud';
import {
  listEquipmentDowntimeLogs,
  getEquipmentDowntimeLog,
  createEquipmentDowntimeLog,
  updateEquipmentDowntimeLog,
  deleteEquipmentDowntimeLog
} from '@features/equipment-downtime-log';

const useEquipmentDowntimeLog = () =>
  useCrud({
    list: listEquipmentDowntimeLogs,
    get: getEquipmentDowntimeLog,
    create: createEquipmentDowntimeLog,
    update: updateEquipmentDowntimeLog,
    remove: deleteEquipmentDowntimeLog,
  });

export default useEquipmentDowntimeLog;
