/**
 * Equipment Location History Model Tests
 * File: equipment-location-history.model.test.js
 */
import {
  normalizeEquipmentLocationHistory,
  normalizeEquipmentLocationHistoryList,
} from '@features/equipment-location-history';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('equipment-location-history.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeEquipmentLocationHistory, normalizeEquipmentLocationHistoryList);
  });
});
