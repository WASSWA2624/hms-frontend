/**
 * Equipment Safety Test Log Use Cases
 * File: equipment-safety-test-log.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { equipmentSafetyTestLogApi } from './equipment-safety-test-log.api';
import { normalizeEquipmentSafetyTestLog, normalizeEquipmentSafetyTestLogList } from './equipment-safety-test-log.model';
import {
  parseEquipmentSafetyTestLogId,
  parseEquipmentSafetyTestLogListParams,
  parseEquipmentSafetyTestLogPayload,
} from './equipment-safety-test-log.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listEquipmentSafetyTestLogs = async (params = {}) =>
  execute(async () => {
    const parsed = parseEquipmentSafetyTestLogListParams(params);
    const response = await equipmentSafetyTestLogApi.list(parsed);
    return normalizeEquipmentSafetyTestLogList(response.data);
  });

const getEquipmentSafetyTestLog = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentSafetyTestLogId(id);
    const response = await equipmentSafetyTestLogApi.get(parsedId);
    return normalizeEquipmentSafetyTestLog(response.data);
  });

const createEquipmentSafetyTestLog = async (payload) =>
  execute(async () => {
    const parsed = parseEquipmentSafetyTestLogPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_SAFETY_TEST_LOGS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentSafetyTestLog(parsed);
    }
    const response = await equipmentSafetyTestLogApi.create(parsed);
    return normalizeEquipmentSafetyTestLog(response.data);
  });

const updateEquipmentSafetyTestLog = async (id, payload) =>
  execute(async () => {
    const parsedId = parseEquipmentSafetyTestLogId(id);
    const parsed = parseEquipmentSafetyTestLogPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_SAFETY_TEST_LOGS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentSafetyTestLog({ id: parsedId, ...parsed });
    }
    const response = await equipmentSafetyTestLogApi.update(parsedId, parsed);
    return normalizeEquipmentSafetyTestLog(response.data);
  });

const deleteEquipmentSafetyTestLog = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentSafetyTestLogId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_SAFETY_TEST_LOGS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeEquipmentSafetyTestLog({ id: parsedId });
    }
    const response = await equipmentSafetyTestLogApi.remove(parsedId);
    return normalizeEquipmentSafetyTestLog(response.data);
  });

export {
  listEquipmentSafetyTestLogs,
  getEquipmentSafetyTestLog,
  createEquipmentSafetyTestLog,
  updateEquipmentSafetyTestLog,
  deleteEquipmentSafetyTestLog,
};
