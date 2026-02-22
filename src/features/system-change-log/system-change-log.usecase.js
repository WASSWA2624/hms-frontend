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

const approveSystemChangeLog = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseSystemChangeLogId(id);
    const parsed = parseSystemChangeLogPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.SYSTEM_CHANGE_LOGS.APPROVE(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeSystemChangeLog({
        id: parsedId,
        status: parsed.status || 'APPROVED',
        ...parsed,
      });
    }
    const response = await systemChangeLogApi.approve(parsedId, parsed);
    return normalizeSystemChangeLog(response.data);
  });

const implementSystemChangeLog = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseSystemChangeLogId(id);
    const parsed = parseSystemChangeLogPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.SYSTEM_CHANGE_LOGS.IMPLEMENT(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeSystemChangeLog({
        id: parsedId,
        status: parsed.status || 'IMPLEMENTED',
        ...parsed,
      });
    }
    const response = await systemChangeLogApi.implement(parsedId, parsed);
    return normalizeSystemChangeLog(response.data);
  });

export {
  listSystemChangeLogs,
  getSystemChangeLog,
  createSystemChangeLog,
  updateSystemChangeLog,
  approveSystemChangeLog,
  implementSystemChangeLog,
};
