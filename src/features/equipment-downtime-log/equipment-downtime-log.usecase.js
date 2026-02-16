/**
 * Equipment Downtime Log Use Cases
 * File: equipment-downtime-log.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { equipmentDowntimeLogApi } from './equipment-downtime-log.api';
import { normalizeEquipmentDowntimeLog, normalizeEquipmentDowntimeLogList } from './equipment-downtime-log.model';
import {
  parseEquipmentDowntimeLogId,
  parseEquipmentDowntimeLogListParams,
  parseEquipmentDowntimeLogPayload,
} from './equipment-downtime-log.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listEquipmentDowntimeLogs = async (params = {}) =>
  execute(async () => {
    const parsed = parseEquipmentDowntimeLogListParams(params);
    const response = await equipmentDowntimeLogApi.list(parsed);
    return normalizeEquipmentDowntimeLogList(response.data);
  });

const getEquipmentDowntimeLog = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentDowntimeLogId(id);
    const response = await equipmentDowntimeLogApi.get(parsedId);
    return normalizeEquipmentDowntimeLog(response.data);
  });

const createEquipmentDowntimeLog = async (payload) =>
  execute(async () => {
    const parsed = parseEquipmentDowntimeLogPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_DOWNTIME_LOGS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentDowntimeLog(parsed);
    }
    const response = await equipmentDowntimeLogApi.create(parsed);
    return normalizeEquipmentDowntimeLog(response.data);
  });

const updateEquipmentDowntimeLog = async (id, payload) =>
  execute(async () => {
    const parsedId = parseEquipmentDowntimeLogId(id);
    const parsed = parseEquipmentDowntimeLogPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_DOWNTIME_LOGS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentDowntimeLog({ id: parsedId, ...parsed });
    }
    const response = await equipmentDowntimeLogApi.update(parsedId, parsed);
    return normalizeEquipmentDowntimeLog(response.data);
  });

const deleteEquipmentDowntimeLog = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentDowntimeLogId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_DOWNTIME_LOGS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeEquipmentDowntimeLog({ id: parsedId });
    }
    const response = await equipmentDowntimeLogApi.remove(parsedId);
    return normalizeEquipmentDowntimeLog(response.data);
  });

export {
  listEquipmentDowntimeLogs,
  getEquipmentDowntimeLog,
  createEquipmentDowntimeLog,
  updateEquipmentDowntimeLog,
  deleteEquipmentDowntimeLog,
};
