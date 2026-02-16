/**
 * useEquipmentCalibrationLog Hook
 * File: useEquipmentCalibrationLog.js
 */
import useCrud from '@hooks/useCrud';
import {
  listEquipmentCalibrationLogs,
  getEquipmentCalibrationLog,
  createEquipmentCalibrationLog,
  updateEquipmentCalibrationLog,
  deleteEquipmentCalibrationLog
} from '@features/equipment-calibration-log';

const useEquipmentCalibrationLog = () =>
  useCrud({
    list: listEquipmentCalibrationLogs,
    get: getEquipmentCalibrationLog,
    create: createEquipmentCalibrationLog,
    update: updateEquipmentCalibrationLog,
    remove: deleteEquipmentCalibrationLog,
  });

export default useEquipmentCalibrationLog;
