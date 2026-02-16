/**
 * useEquipmentSafetyTestLog Hook
 * File: useEquipmentSafetyTestLog.js
 */
import useCrud from '@hooks/useCrud';
import {
  listEquipmentSafetyTestLogs,
  getEquipmentSafetyTestLog,
  createEquipmentSafetyTestLog,
  updateEquipmentSafetyTestLog,
  deleteEquipmentSafetyTestLog
} from '@features/equipment-safety-test-log';

const useEquipmentSafetyTestLog = () =>
  useCrud({
    list: listEquipmentSafetyTestLogs,
    get: getEquipmentSafetyTestLog,
    create: createEquipmentSafetyTestLog,
    update: updateEquipmentSafetyTestLog,
    remove: deleteEquipmentSafetyTestLog,
  });

export default useEquipmentSafetyTestLog;
