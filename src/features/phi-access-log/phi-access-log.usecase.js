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

const listPhiAccessLogsByUser = async (userId, params = {}) =>
  execute(async () => {
    const parsedUserId = parsePhiAccessLogId(userId);
    const parsedParams = parsePhiAccessLogListParams(params);
    const response = await phiAccessLogApi.listByUser(parsedUserId, parsedParams);
    return normalizePhiAccessLogList(response.data);
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

export { listPhiAccessLogs, getPhiAccessLog, createPhiAccessLog, listPhiAccessLogsByUser };
