/**
 * Equipment Utilization Snapshot Model Tests
 * File: equipment-utilization-snapshot.model.test.js
 */
import {
  normalizeEquipmentUtilizationSnapshot,
  normalizeEquipmentUtilizationSnapshotList,
} from '@features/equipment-utilization-snapshot';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('equipment-utilization-snapshot.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeEquipmentUtilizationSnapshot, normalizeEquipmentUtilizationSnapshotList);
  });
});
