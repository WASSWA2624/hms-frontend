/**
 * Equipment Registry Model Tests
 * File: equipment-registry.model.test.js
 */
import {
  normalizeEquipmentRegistry,
  normalizeEquipmentRegistryList,
} from '@features/equipment-registry';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('equipment-registry.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeEquipmentRegistry, normalizeEquipmentRegistryList);
  });
});
