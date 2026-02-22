/**
 * Integration Log Use Cases
 * File: integration-log.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { integrationLogApi } from './integration-log.api';
import { normalizeIntegrationLog, normalizeIntegrationLogList } from './integration-log.model';
import {
  parseIntegrationLogId,
  parseIntegrationLogListParams,
  parseIntegrationLogPayload,
} from './integration-log.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listIntegrationLogs = async (params = {}) =>
  execute(async () => {
    const parsed = parseIntegrationLogListParams(params);
    const response = await integrationLogApi.list(parsed);
    return normalizeIntegrationLogList(response.data);
  });

const getIntegrationLog = async (id) =>
  execute(async () => {
    const parsedId = parseIntegrationLogId(id);
    const response = await integrationLogApi.get(parsedId);
    return normalizeIntegrationLog(response.data);
  });

const listIntegrationLogsByIntegration = async (integrationId, params = {}) =>
  execute(async () => {
    const parsedIntegrationId = parseIntegrationLogId(integrationId);
    const parsedParams = parseIntegrationLogListParams(params);
    const response = await integrationLogApi.listByIntegration(
      parsedIntegrationId,
      parsedParams
    );
    return normalizeIntegrationLogList(response.data);
  });

const replayIntegrationLog = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseIntegrationLogId(id);
    const parsed = parseIntegrationLogPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.INTEGRATION_LOGS.REPLAY(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeIntegrationLog({ id: parsedId, ...parsed });
    }
    const response = await integrationLogApi.replay(parsedId, parsed);
    return normalizeIntegrationLog(response.data);
  });

export {
  listIntegrationLogs,
  getIntegrationLog,
  listIntegrationLogsByIntegration,
  replayIntegrationLog,
};
