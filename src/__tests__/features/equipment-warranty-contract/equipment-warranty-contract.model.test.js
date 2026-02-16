/**
 * Equipment Warranty Contract Model Tests
 * File: equipment-warranty-contract.model.test.js
 */
import {
  normalizeEquipmentWarrantyContract,
  normalizeEquipmentWarrantyContractList,
} from '@features/equipment-warranty-contract';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('equipment-warranty-contract.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeEquipmentWarrantyContract, normalizeEquipmentWarrantyContractList);
  });
});
