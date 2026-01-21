/**
 * Data Processing Log Use Cases
 * File: data-processing-log.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { dataProcessingLogApi } from './data-processing-log.api';
import { normalizeDataProcessingLog, normalizeDataProcessingLogList } from './data-processing-log.model';
import {
  parseDataProcessingLogId,
  parseDataProcessingLogListParams,
  parseDataProcessingLogPayload,
} from './data-processing-log.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listDataProcessingLogs = async (params = {}) =>
  execute(async () => {
    const parsed = parseDataProcessingLogListParams(params);
    const response = await dataProcessingLogApi.list(parsed);
    return normalizeDataProcessingLogList(response.data);
  });

const getDataProcessingLog = async (id) =>
  execute(async () => {
    const parsedId = parseDataProcessingLogId(id);
    const response = await dataProcessingLogApi.get(parsedId);
    return normalizeDataProcessingLog(response.data);
  });

const createDataProcessingLog = async (payload) =>
  execute(async () => {
    const parsed = parseDataProcessingLogPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.DATA_PROCESSING_LOGS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeDataProcessingLog(parsed);
    }
    const response = await dataProcessingLogApi.create(parsed);
    return normalizeDataProcessingLog(response.data);
  });

const updateDataProcessingLog = async (id, payload) =>
  execute(async () => {
    const parsedId = parseDataProcessingLogId(id);
    const parsed = parseDataProcessingLogPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.DATA_PROCESSING_LOGS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeDataProcessingLog({ id: parsedId, ...parsed });
    }
    const response = await dataProcessingLogApi.update(parsedId, parsed);
    return normalizeDataProcessingLog(response.data);
  });

const deleteDataProcessingLog = async (id) =>
  execute(async () => {
    const parsedId = parseDataProcessingLogId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.DATA_PROCESSING_LOGS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeDataProcessingLog({ id: parsedId });
    }
    const response = await dataProcessingLogApi.remove(parsedId);
    return normalizeDataProcessingLog(response.data);
  });

export {
  listDataProcessingLogs,
  getDataProcessingLog,
  createDataProcessingLog,
  updateDataProcessingLog,
  deleteDataProcessingLog,
};
