/**
 * API Key Permission Use Cases
 * File: api-key-permission.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { apiKeyPermissionApi } from './api-key-permission.api';
import { normalizeApiKeyPermission, normalizeApiKeyPermissionList } from './api-key-permission.model';
import {
  parseApiKeyPermissionId,
  parseApiKeyPermissionListParams,
  parseApiKeyPermissionPayload,
} from './api-key-permission.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listApiKeyPermissions = async (params = {}) =>
  execute(async () => {
    const parsed = parseApiKeyPermissionListParams(params);
    const response = await apiKeyPermissionApi.list(parsed);
    return normalizeApiKeyPermissionList(response.data);
  });

const getApiKeyPermission = async (id) =>
  execute(async () => {
    const parsedId = parseApiKeyPermissionId(id);
    const response = await apiKeyPermissionApi.get(parsedId);
    return normalizeApiKeyPermission(response.data);
  });

const createApiKeyPermission = async (payload) =>
  execute(async () => {
    const parsed = parseApiKeyPermissionPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.API_KEY_PERMISSIONS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeApiKeyPermission(parsed);
    }
    const response = await apiKeyPermissionApi.create(parsed);
    return normalizeApiKeyPermission(response.data);
  });

const updateApiKeyPermission = async (id, payload) =>
  execute(async () => {
    const parsedId = parseApiKeyPermissionId(id);
    const parsed = parseApiKeyPermissionPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.API_KEY_PERMISSIONS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeApiKeyPermission({ id: parsedId, ...parsed });
    }
    const response = await apiKeyPermissionApi.update(parsedId, parsed);
    return normalizeApiKeyPermission(response.data);
  });

const deleteApiKeyPermission = async (id) =>
  execute(async () => {
    const parsedId = parseApiKeyPermissionId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.API_KEY_PERMISSIONS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeApiKeyPermission({ id: parsedId });
    }
    const response = await apiKeyPermissionApi.remove(parsedId);
    return normalizeApiKeyPermission(response.data);
  });

export {
  listApiKeyPermissions,
  getApiKeyPermission,
  createApiKeyPermission,
  updateApiKeyPermission,
  deleteApiKeyPermission,
};
