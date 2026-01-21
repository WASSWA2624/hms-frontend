/**
 * API Key Use Cases
 * File: api-key.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { apiKeyApi } from './api-key.api';
import { normalizeApiKey, normalizeApiKeyList } from './api-key.model';
import { parseApiKeyId, parseApiKeyListParams, parseApiKeyPayload } from './api-key.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listApiKeys = async (params = {}) =>
  execute(async () => {
    const parsed = parseApiKeyListParams(params);
    const response = await apiKeyApi.list(parsed);
    return normalizeApiKeyList(response.data);
  });

const getApiKey = async (id) =>
  execute(async () => {
    const parsedId = parseApiKeyId(id);
    const response = await apiKeyApi.get(parsedId);
    return normalizeApiKey(response.data);
  });

const createApiKey = async (payload) =>
  execute(async () => {
    const parsed = parseApiKeyPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.API_KEYS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeApiKey(parsed);
    }
    const response = await apiKeyApi.create(parsed);
    return normalizeApiKey(response.data);
  });

const updateApiKey = async (id, payload) =>
  execute(async () => {
    const parsedId = parseApiKeyId(id);
    const parsed = parseApiKeyPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.API_KEYS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeApiKey({ id: parsedId, ...parsed });
    }
    const response = await apiKeyApi.update(parsedId, parsed);
    return normalizeApiKey(response.data);
  });

const deleteApiKey = async (id) =>
  execute(async () => {
    const parsedId = parseApiKeyId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.API_KEYS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeApiKey({ id: parsedId });
    }
    const response = await apiKeyApi.remove(parsedId);
    return normalizeApiKey(response.data);
  });

export { listApiKeys, getApiKey, createApiKey, updateApiKey, deleteApiKey };
