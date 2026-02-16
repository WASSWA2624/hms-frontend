/**
 * Equipment Category Rules Tests
 * File: equipment-category.rules.test.js
 */
import {
  parseEquipmentCategoryId,
  parseEquipmentCategoryListParams,
  parseEquipmentCategoryPayload,
} from '@features/equipment-category';
import {
  expectIdParser,
  expectListParamsParser,
  expectPayloadParser,
} from '../../helpers/crud-assertions';

describe('equipment-category.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseEquipmentCategoryId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseEquipmentCategoryPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseEquipmentCategoryListParams);
  });
});
