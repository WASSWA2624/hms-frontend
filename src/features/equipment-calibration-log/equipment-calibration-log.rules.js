/**
 * Equipment Calibration Log Rules
 * File: equipment-calibration-log.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseEquipmentCalibrationLogId = (value) => parseId(value);
const parseEquipmentCalibrationLogPayload = (value) => parsePayload(value);
const parseEquipmentCalibrationLogListParams = (value) => parseListParams(value);

export {
  parseEquipmentCalibrationLogId,
  parseEquipmentCalibrationLogPayload,
  parseEquipmentCalibrationLogListParams,
};
