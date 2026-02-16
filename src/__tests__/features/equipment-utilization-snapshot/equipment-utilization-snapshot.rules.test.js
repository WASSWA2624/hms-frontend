/**
 * Equipment Utilization Snapshot Rules Tests
 * File: equipment-utilization-snapshot.rules.test.js
 */
import {
  parseEquipmentUtilizationSnapshotId,
  parseEquipmentUtilizationSnapshotListParams,
  parseEquipmentUtilizationSnapshotPayload,
} from '@features/equipment-utilization-snapshot';
import {
  expectIdParser,
  expectListParamsParser,
  expectPayloadParser,
} from '../../helpers/crud-assertions';

describe('equipment-utilization-snapshot.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseEquipmentUtilizationSnapshotId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseEquipmentUtilizationSnapshotPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseEquipmentUtilizationSnapshotListParams);
  });
});
