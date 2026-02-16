/**
 * Equipment Calibration Log Use Cases
 * File: equipment-calibration-log.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { equipmentCalibrationLogApi } from './equipment-calibration-log.api';
import { normalizeEquipmentCalibrationLog, normalizeEquipmentCalibrationLogList } from './equipment-calibration-log.model';
import {
  parseEquipmentCalibrationLogId,
  parseEquipmentCalibrationLogListParams,
  parseEquipmentCalibrationLogPayload,
} from './equipment-calibration-log.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listEquipmentCalibrationLogs = async (params = {}) =>
  execute(async () => {
    const parsed = parseEquipmentCalibrationLogListParams(params);
    const response = await equipmentCalibrationLogApi.list(parsed);
    return normalizeEquipmentCalibrationLogList(response.data);
  });

const getEquipmentCalibrationLog = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentCalibrationLogId(id);
    const response = await equipmentCalibrationLogApi.get(parsedId);
    return normalizeEquipmentCalibrationLog(response.data);
  });

const createEquipmentCalibrationLog = async (payload) =>
  execute(async () => {
    const parsed = parseEquipmentCalibrationLogPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_CALIBRATION_LOGS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentCalibrationLog(parsed);
    }
    const response = await equipmentCalibrationLogApi.create(parsed);
    return normalizeEquipmentCalibrationLog(response.data);
  });

const updateEquipmentCalibrationLog = async (id, payload) =>
  execute(async () => {
    const parsedId = parseEquipmentCalibrationLogId(id);
    const parsed = parseEquipmentCalibrationLogPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_CALIBRATION_LOGS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeEquipmentCalibrationLog({ id: parsedId, ...parsed });
    }
    const response = await equipmentCalibrationLogApi.update(parsedId, parsed);
    return normalizeEquipmentCalibrationLog(response.data);
  });

const deleteEquipmentCalibrationLog = async (id) =>
  execute(async () => {
    const parsedId = parseEquipmentCalibrationLogId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.EQUIPMENT_CALIBRATION_LOGS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeEquipmentCalibrationLog({ id: parsedId });
    }
    const response = await equipmentCalibrationLogApi.remove(parsedId);
    return normalizeEquipmentCalibrationLog(response.data);
  });

export {
  listEquipmentCalibrationLogs,
  getEquipmentCalibrationLog,
  createEquipmentCalibrationLog,
  updateEquipmentCalibrationLog,
  deleteEquipmentCalibrationLog,
};
