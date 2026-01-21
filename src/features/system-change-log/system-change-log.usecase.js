/**
 * System Change Log Use Cases
 * File: system-change-log.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { systemChangeLogApi } from './system-change-log.api';
import { normalizeSystemChangeLog, normalizeSystemChangeLogList } from './system-change-log.model';
import {
  parseSystemChangeLogId,
  parseSystemChangeLogListParams,
  parseSystemChangeLogPayload,
} from './system-change-log.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listSystemChangeLogs = async (params = {}) =>
  execute(async () => {
    const parsed = parseSystemChangeLogListParams(params);
    const response = await systemChangeLogApi.list(parsed);
    return normalizeSystemChangeLogList(response.data);
  });

const getSystemChangeLog = async (id) =>
  execute(async () => {
    const parsedId = parseSystemChangeLogId(id);
    const response = await systemChangeLogApi.get(parsedId);
    return normalizeSystemChangeLog(response.data);
  });

const createSystemChangeLog = async (payload) =>
  execute(async () => {
    const parsed = parseSystemChangeLogPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.SYSTEM_CHANGE_LOGS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeSystemChangeLog(parsed);
    }
    const response = await systemChangeLogApi.create(parsed);
    return normalizeSystemChangeLog(response.data);
  });

const updateSystemChangeLog = async (id, payload) =>
  execute(async () => {
    const parsedId = parseSystemChangeLogId(id);
    const parsed = parseSystemChangeLogPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.SYSTEM_CHANGE_LOGS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeSystemChangeLog({ id: parsedId, ...parsed });
    }
    const response = await systemChangeLogApi.update(parsedId, parsed);
    return normalizeSystemChangeLog(response.data);
  });

const deleteSystemChangeLog = async (id) =>
  execute(async () => {
    const parsedId = parseSystemChangeLogId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.SYSTEM_CHANGE_LOGS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeSystemChangeLog({ id: parsedId });
    }
    const response = await systemChangeLogApi.remove(parsedId);
    return normalizeSystemChangeLog(response.data);
  });

export {
  listSystemChangeLogs,
  getSystemChangeLog,
  createSystemChangeLog,
  updateSystemChangeLog,
  deleteSystemChangeLog,
};
