/**
 * Equipment Utilization Snapshot Model
 * File: equipment-utilization-snapshot.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeEquipmentUtilizationSnapshot = (value) => normalize(value);
const normalizeEquipmentUtilizationSnapshotList = (value) => normalizeList(value);

export { normalizeEquipmentUtilizationSnapshot, normalizeEquipmentUtilizationSnapshotList };
