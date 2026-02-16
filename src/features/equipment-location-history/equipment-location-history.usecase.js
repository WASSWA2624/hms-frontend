/**
 * Equipment Location History Use Cases
 * File: equipment-location-history.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { equipmentLocationHistoryApi } from './equipment-location-history.api';
import { normalizeEquipmentLocationHistory, normalizeEquipmentLocationHistoryList } from './equipment-location-history.model';
import {
  parseEquipmentLocationHistoryId,
  parseEquipmentLocationHistoryListParams,
  parseEquipmentLocationHistoryPayload,
} from './equipment-location-history.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listEquipmentLocationHistories = async (params = {}) =>
  execute(async () => {
    const parsed = parseEquipmentLocationHistoryListParams(params);
    const response = await equipmentLocationHistoryApi.list(parsed);
    return normalizeEquipmentLocationHistoryList(response.data);
  });

const getEquipmentLocationHistory = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentLocationHistoryId(id);
    const response = await equipmentLocationHistoryApi.get(parsedId);
    return normalizeEquipmentLocationHistory(response.data);
  });

const createEquipmentLocationHistory = async (payload) =>
  execute(async () => {
    const parsed = parseEquipmentLocationHistoryPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_LOCATION_HISTORIES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentLocationHistory(parsed);
    }
    const response = await equipmentLocationHistoryApi.create(parsed);
    return normalizeEquipmentLocationHistory(response.data);
  });

const updateEquipmentLocationHistory = async (id, payload) =>
  execute(async () => {
    const parsedId = parseEquipmentLocationHistoryId(id);
    const parsed = parseEquipmentLocationHistoryPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_LOCATION_HISTORIES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentLocationHistory({ id: parsedId, ...parsed });
    }
    const response = await equipmentLocationHistoryApi.update(parsedId, parsed);
    return normalizeEquipmentLocationHistory(response.data);
  });

const deleteEquipmentLocationHistory = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentLocationHistoryId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_LOCATION_HISTORIES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeEquipmentLocationHistory({ id: parsedId });
    }
    const response = await equipmentLocationHistoryApi.remove(parsedId);
    return normalizeEquipmentLocationHistory(response.data);
  });

export {
  listEquipmentLocationHistories,
  getEquipmentLocationHistory,
  createEquipmentLocationHistory,
  updateEquipmentLocationHistory,
  deleteEquipmentLocationHistory,
};
