/**
 * Equipment Calibration Log Rules Tests
 * File: equipment-calibration-log.rules.test.js
 */
import {
  parseEquipmentCalibrationLogId,
  parseEquipmentCalibrationLogListParams,
  parseEquipmentCalibrationLogPayload,
} from '@features/equipment-calibration-log';
import {
  expectIdParser,
  expectListParamsParser,
  expectPayloadParser,
} from '../../helpers/crud-assertions';

describe('equipment-calibration-log.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseEquipmentCalibrationLogId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseEquipmentCalibrationLogPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseEquipmentCalibrationLogListParams);
  });
});
