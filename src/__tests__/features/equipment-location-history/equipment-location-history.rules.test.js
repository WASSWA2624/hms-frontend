/**
 * Equipment Location History Rules Tests
 * File: equipment-location-history.rules.test.js
 */
import {
  parseEquipmentLocationHistoryId,
  parseEquipmentLocationHistoryListParams,
  parseEquipmentLocationHistoryPayload,
} from '@features/equipment-location-history';
import {
  expectIdParser,
  expectListParamsParser,
  expectPayloadParser,
} from '../../helpers/crud-assertions';

describe('equipment-location-history.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseEquipmentLocationHistoryId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseEquipmentLocationHistoryPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseEquipmentLocationHistoryListParams);
  });
});
