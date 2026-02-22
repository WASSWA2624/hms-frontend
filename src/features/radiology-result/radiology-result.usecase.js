/**
 * Radiology Result Use Cases
 * File: radiology-result.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { radiologyResultApi } from './radiology-result.api';
import { normalizeRadiologyResult, normalizeRadiologyResultList } from './radiology-result.model';
import { parseRadiologyResultId, parseRadiologyResultListParams, parseRadiologyResultPayload } from './radiology-result.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listRadiologyResults = async (params = {}) =>
  execute(async () => {
    const parsed = parseRadiologyResultListParams(params);
    const response = await radiologyResultApi.list(parsed);
    return normalizeRadiologyResultList(response.data);
  });

const getRadiologyResult = async (id) =>
  execute(async () => {
    const parsedId = parseRadiologyResultId(id);
    const response = await radiologyResultApi.get(parsedId);
    return normalizeRadiologyResult(response.data);
  });

const createRadiologyResult = async (payload) =>
  execute(async () => {
    const parsed = parseRadiologyResultPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.RADIOLOGY_RESULTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeRadiologyResult(parsed);
    }
    const response = await radiologyResultApi.create(parsed);
    return normalizeRadiologyResult(response.data);
  });

const updateRadiologyResult = async (id, payload) =>
  execute(async () => {
    const parsedId = parseRadiologyResultId(id);
    const parsed = parseRadiologyResultPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.RADIOLOGY_RESULTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeRadiologyResult({ id: parsedId, ...parsed });
    }
    const response = await radiologyResultApi.update(parsedId, parsed);
    return normalizeRadiologyResult(response.data);
  });

const deleteRadiologyResult = async (id) =>
  execute(async () => {
    const parsedId = parseRadiologyResultId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.RADIOLOGY_RESULTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeRadiologyResult({ id: parsedId });
    }
    const response = await radiologyResultApi.remove(parsedId);
    return normalizeRadiologyResult(response.data);
  });

const signOffRadiologyResult = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyResultId(id);
    const parsed = parseRadiologyResultPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.RADIOLOGY_RESULTS.SIGN_OFF(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeRadiologyResult({ id: parsedId, status: 'FINAL', ...parsed });
    }
    const response = await radiologyResultApi.signOff(parsedId, parsed);
    return normalizeRadiologyResult(response.data);
  });

export {
  listRadiologyResults,
  getRadiologyResult,
  createRadiologyResult,
  updateRadiologyResult,
  deleteRadiologyResult,
  signOffRadiologyResult,
};
