/**
 * Equipment Warranty Contract Rules Tests
 * File: equipment-warranty-contract.rules.test.js
 */
import {
  parseEquipmentWarrantyContractId,
  parseEquipmentWarrantyContractListParams,
  parseEquipmentWarrantyContractPayload,
} from '@features/equipment-warranty-contract';
import {
  expectIdParser,
  expectListParamsParser,
  expectPayloadParser,
} from '../../helpers/crud-assertions';

describe('equipment-warranty-contract.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseEquipmentWarrantyContractId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseEquipmentWarrantyContractPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseEquipmentWarrantyContractListParams);
  });
});
