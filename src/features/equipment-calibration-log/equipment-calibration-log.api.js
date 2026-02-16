/**
 * Equipment Calibration Log API
 * File: equipment-calibration-log.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const equipmentCalibrationLogApi = createCrudApi(endpoints.EQUIPMENT_CALIBRATION_LOGS);

export { equipmentCalibrationLogApi };
