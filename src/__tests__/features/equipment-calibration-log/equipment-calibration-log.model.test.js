/**
 * Equipment Calibration Log Model Tests
 * File: equipment-calibration-log.model.test.js
 */
import {
  normalizeEquipmentCalibrationLog,
  normalizeEquipmentCalibrationLogList,
} from '@features/equipment-calibration-log';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('equipment-calibration-log.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeEquipmentCalibrationLog, normalizeEquipmentCalibrationLogList);
  });
});
