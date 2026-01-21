/**
 * Ward Use Cases
 * File: ward.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { getWardBedsApi, wardApi } from './ward.api';
import { normalizeWard, normalizeWardList } from './ward.model';
import { parseWardId, parseWardListParams, parseWardPayload } from './ward.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listWards = async (params = {}) =>
  execute(async () => {
    const parsed = parseWardListParams(params);
    const response = await wardApi.list(parsed);
    return normalizeWardList(response.data);
  });

const getWard = async (id) =>
  execute(async () => {
    const parsedId = parseWardId(id);
    const response = await wardApi.get(parsedId);
    return normalizeWard(response.data);
  });

const createWard = async (payload) =>
  execute(async () => {
    const parsed = parseWardPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.WARDS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeWard(parsed);
    }
    const response = await wardApi.create(parsed);
    return normalizeWard(response.data);
  });

const updateWard = async (id, payload) =>
  execute(async () => {
    const parsedId = parseWardId(id);
    const parsed = parseWardPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.WARDS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeWard({ id: parsedId, ...parsed });
    }
    const response = await wardApi.update(parsedId, parsed);
    return normalizeWard(response.data);
  });

const deleteWard = async (id) =>
  execute(async () => {
    const parsedId = parseWardId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.WARDS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeWard({ id: parsedId });
    }
    const response = await wardApi.remove(parsedId);
    return normalizeWard(response.data);
  });

const listWardBeds = async (id) =>
  execute(async () => {
    const parsedId = parseWardId(id);
    const response = await getWardBedsApi(parsedId);
    return normalizeWardList(response.data);
  });

export { listWards, getWard, createWard, updateWard, deleteWard, listWardBeds };
