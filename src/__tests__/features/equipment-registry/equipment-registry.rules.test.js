/**
 * Equipment Registry Rules Tests
 * File: equipment-registry.rules.test.js
 */
import {
  parseEquipmentRegistryId,
  parseEquipmentRegistryListParams,
  parseEquipmentRegistryPayload,
} from '@features/equipment-registry';
import {
  expectIdParser,
  expectListParamsParser,
  expectPayloadParser,
} from '../../helpers/crud-assertions';

describe('equipment-registry.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseEquipmentRegistryId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseEquipmentRegistryPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseEquipmentRegistryListParams);
  });
});
