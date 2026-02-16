/**
 * Equipment Downtime Log Rules Tests
 * File: equipment-downtime-log.rules.test.js
 */
import {
  parseEquipmentDowntimeLogId,
  parseEquipmentDowntimeLogListParams,
  parseEquipmentDowntimeLogPayload,
} from '@features/equipment-downtime-log';
import {
  expectIdParser,
  expectListParamsParser,
  expectPayloadParser,
} from '../../helpers/crud-assertions';

describe('equipment-downtime-log.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseEquipmentDowntimeLogId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseEquipmentDowntimeLogPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseEquipmentDowntimeLogListParams);
  });
});
