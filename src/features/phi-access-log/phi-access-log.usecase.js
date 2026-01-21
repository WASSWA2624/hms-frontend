/**
 * PHI Access Log Use Cases
 * File: phi-access-log.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { phiAccessLogApi } from './phi-access-log.api';
import { normalizePhiAccessLog, normalizePhiAccessLogList } from './phi-access-log.model';
import {
  parsePhiAccessLogId,
  parsePhiAccessLogListParams,
  parsePhiAccessLogPayload,
} from './phi-access-log.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listPhiAccessLogs = async (params = {}) =>
  execute(async () => {
    const parsed = parsePhiAccessLogListParams(params);
    const response = await phiAccessLogApi.list(parsed);
    return normalizePhiAccessLogList(response.data);
  });

const getPhiAccessLog = async (id) =>
  execute(async () => {
    const parsedId = parsePhiAccessLogId(id);
    const response = await phiAccessLogApi.get(parsedId);
    return normalizePhiAccessLog(response.data);
  });

const createPhiAccessLog = async (payload) =>
  execute(async () => {
    const parsed = parsePhiAccessLogPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PHI_ACCESS_LOGS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizePhiAccessLog(parsed);
    }
    const response = await phiAccessLogApi.create(parsed);
    return normalizePhiAccessLog(response.data);
  });

const updatePhiAccessLog = async (id, payload) =>
  execute(async () => {
    const parsedId = parsePhiAccessLogId(id);
    const parsed = parsePhiAccessLogPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PHI_ACCESS_LOGS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizePhiAccessLog({ id: parsedId, ...parsed });
    }
    const response = await phiAccessLogApi.update(parsedId, parsed);
    return normalizePhiAccessLog(response.data);
  });

const deletePhiAccessLog = async (id) =>
  execute(async () => {
    const parsedId = parsePhiAccessLogId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.PHI_ACCESS_LOGS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizePhiAccessLog({ id: parsedId });
    }
    const response = await phiAccessLogApi.remove(parsedId);
    return normalizePhiAccessLog(response.data);
  });

export { listPhiAccessLogs, getPhiAccessLog, createPhiAccessLog, updatePhiAccessLog, deletePhiAccessLog };
