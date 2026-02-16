/**
 * Equipment Calibration Log Model
 * File: equipment-calibration-log.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeEquipmentCalibrationLog = (value) => normalize(value);
const normalizeEquipmentCalibrationLogList = (value) => normalizeList(value);

export { normalizeEquipmentCalibrationLog, normalizeEquipmentCalibrationLogList };
