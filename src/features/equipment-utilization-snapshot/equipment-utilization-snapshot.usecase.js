/**
 * Equipment Utilization Snapshot Use Cases
 * File: equipment-utilization-snapshot.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { equipmentUtilizationSnapshotApi } from './equipment-utilization-snapshot.api';
import { normalizeEquipmentUtilizationSnapshot, normalizeEquipmentUtilizationSnapshotList } from './equipment-utilization-snapshot.model';
import {
  parseEquipmentUtilizationSnapshotId,
  parseEquipmentUtilizationSnapshotListParams,
  parseEquipmentUtilizationSnapshotPayload,
} from './equipment-utilization-snapshot.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listEquipmentUtilizationSnapshots = async (params = {}) =>
  execute(async () => {
    const parsed = parseEquipmentUtilizationSnapshotListParams(params);
    const response = await equipmentUtilizationSnapshotApi.list(parsed);
    return normalizeEquipmentUtilizationSnapshotList(response.data);
  });

const getEquipmentUtilizationSnapshot = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentUtilizationSnapshotId(id);
    const response = await equipmentUtilizationSnapshotApi.get(parsedId);
    return normalizeEquipmentUtilizationSnapshot(response.data);
  });

const createEquipmentUtilizationSnapshot = async (payload) =>
  execute(async () => {
    const parsed = parseEquipmentUtilizationSnapshotPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_UTILIZATION_SNAPSHOTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentUtilizationSnapshot(parsed);
    }
    const response = await equipmentUtilizationSnapshotApi.create(parsed);
    return normalizeEquipmentUtilizationSnapshot(response.data);
  });

const updateEquipmentUtilizationSnapshot = async (id, payload) =>
  execute(async () => {
    const parsedId = parseEquipmentUtilizationSnapshotId(id);
    const parsed = parseEquipmentUtilizationSnapshotPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_UTILIZATION_SNAPSHOTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentUtilizationSnapshot({ id: parsedId, ...parsed });
    }
    const response = await equipmentUtilizationSnapshotApi.update(parsedId, parsed);
    return normalizeEquipmentUtilizationSnapshot(response.data);
  });

const deleteEquipmentUtilizationSnapshot = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentUtilizationSnapshotId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_UTILIZATION_SNAPSHOTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeEquipmentUtilizationSnapshot({ id: parsedId });
    }
    const response = await equipmentUtilizationSnapshotApi.remove(parsedId);
    return normalizeEquipmentUtilizationSnapshot(response.data);
  });

export {
  listEquipmentUtilizationSnapshots,
  getEquipmentUtilizationSnapshot,
  createEquipmentUtilizationSnapshot,
  updateEquipmentUtilizationSnapshot,
  deleteEquipmentUtilizationSnapshot,
};
