/**
 * Discharge Summary Use Cases
 * File: discharge-summary.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { dischargeSummaryApi } from './discharge-summary.api';
import { normalizeDischargeSummary, normalizeDischargeSummaryList } from './discharge-summary.model';
import {
  parseDischargeSummaryId,
  parseDischargeSummaryListParams,
  parseDischargeSummaryPayload,
} from './discharge-summary.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listDischargeSummaries = async (params = {}) =>
  execute(async () => {
    const parsed = parseDischargeSummaryListParams(params);
    const response = await dischargeSummaryApi.list(parsed);
    return normalizeDischargeSummaryList(response.data);
  });

const getDischargeSummary = async (id) =>
  execute(async () => {
    const parsedId = parseDischargeSummaryId(id);
    const response = await dischargeSummaryApi.get(parsedId);
    return normalizeDischargeSummary(response.data);
  });

const createDischargeSummary = async (payload) =>
  execute(async () => {
    const parsed = parseDischargeSummaryPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.DISCHARGE_SUMMARIES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeDischargeSummary(parsed);
    }
    const response = await dischargeSummaryApi.create(parsed);
    return normalizeDischargeSummary(response.data);
  });

const updateDischargeSummary = async (id, payload) =>
  execute(async () => {
    const parsedId = parseDischargeSummaryId(id);
    const parsed = parseDischargeSummaryPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.DISCHARGE_SUMMARIES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeDischargeSummary({ id: parsedId, ...parsed });
    }
    const response = await dischargeSummaryApi.update(parsedId, parsed);
    return normalizeDischargeSummary(response.data);
  });

const deleteDischargeSummary = async (id) =>
  execute(async () => {
    const parsedId = parseDischargeSummaryId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.DISCHARGE_SUMMARIES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeDischargeSummary({ id: parsedId });
    }
    const response = await dischargeSummaryApi.remove(parsedId);
    return normalizeDischargeSummary(response.data);
  });

const finalizeDischargeSummary = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseDischargeSummaryId(id);
    const parsed = parseDischargeSummaryPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.DISCHARGE_SUMMARIES.FINALIZE(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeDischargeSummary({ id: parsedId, status: 'COMPLETED', ...parsed });
    }
    const response = await dischargeSummaryApi.finalize(parsedId, parsed);
    return normalizeDischargeSummary(response.data);
  });

export {
  listDischargeSummaries,
  getDischargeSummary,
  createDischargeSummary,
  updateDischargeSummary,
  deleteDischargeSummary,
  finalizeDischargeSummary,
};
