/**
 * Equipment Utilization Snapshot Rules
 * File: equipment-utilization-snapshot.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseEquipmentUtilizationSnapshotId = (value) => parseId(value);
const parseEquipmentUtilizationSnapshotPayload = (value) => parsePayload(value);
const parseEquipmentUtilizationSnapshotListParams = (value) => parseListParams(value);

export {
  parseEquipmentUtilizationSnapshotId,
  parseEquipmentUtilizationSnapshotPayload,
  parseEquipmentUtilizationSnapshotListParams,
};
