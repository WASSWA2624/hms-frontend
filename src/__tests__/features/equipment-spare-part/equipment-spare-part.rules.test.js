/**
 * Equipment Spare Part Rules Tests
 * File: equipment-spare-part.rules.test.js
 */
import {
  parseEquipmentSparePartId,
  parseEquipmentSparePartListParams,
  parseEquipmentSparePartPayload,
} from '@features/equipment-spare-part';
import {
  expectIdParser,
  expectListParamsParser,
  expectPayloadParser,
} from '../../helpers/crud-assertions';

describe('equipment-spare-part.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseEquipmentSparePartId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseEquipmentSparePartPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseEquipmentSparePartListParams);
  });
});
