/**
 * Equipment Safety Test Log Rules Tests
 * File: equipment-safety-test-log.rules.test.js
 */
import {
  parseEquipmentSafetyTestLogId,
  parseEquipmentSafetyTestLogListParams,
  parseEquipmentSafetyTestLogPayload,
} from '@features/equipment-safety-test-log';
import {
  expectIdParser,
  expectListParamsParser,
  expectPayloadParser,
} from '../../helpers/crud-assertions';

describe('equipment-safety-test-log.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseEquipmentSafetyTestLogId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseEquipmentSafetyTestLogPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseEquipmentSafetyTestLogListParams);
  });
});
