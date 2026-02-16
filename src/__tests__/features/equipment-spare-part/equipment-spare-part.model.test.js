/**
 * Equipment Spare Part Model Tests
 * File: equipment-spare-part.model.test.js
 */
import {
  normalizeEquipmentSparePart,
  normalizeEquipmentSparePartList,
} from '@features/equipment-spare-part';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('equipment-spare-part.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeEquipmentSparePart, normalizeEquipmentSparePartList);
  });
});
