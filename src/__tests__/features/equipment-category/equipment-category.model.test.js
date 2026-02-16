/**
 * Equipment Category Model Tests
 * File: equipment-category.model.test.js
 */
import {
  normalizeEquipmentCategory,
  normalizeEquipmentCategoryList,
} from '@features/equipment-category';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('equipment-category.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeEquipmentCategory, normalizeEquipmentCategoryList);
  });
});
