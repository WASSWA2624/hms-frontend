/**
 * Permission Use Cases
 * File: permission.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { permissionApi } from './permission.api';
import { normalizePermission, normalizePermissionList } from './permission.model';
import { parsePermissionId, parsePermissionListParams, parsePermissionPayload } from './permission.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listPermissions = async (params = {}) =>
  execute(async () => {
    const parsed = parsePermissionListParams(params);
    const response = await permissionApi.list(parsed);
    return normalizePermissionList(response.data);
  });

const getPermission = async (id) =>
  execute(async () => {
    const parsedId = parsePermissionId(id);
    const response = await permissionApi.get(parsedId);
    return normalizePermission(response.data);
  });

const createPermission = async (payload) =>
  execute(async () => {
    const parsed = parsePermissionPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PERMISSIONS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizePermission(parsed);
    }
    const response = await permissionApi.create(parsed);
    return normalizePermission(response.data);
  });

const updatePermission = async (id, payload) =>
  execute(async () => {
    const parsedId = parsePermissionId(id);
    const parsed = parsePermissionPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PERMISSIONS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizePermission({ id: parsedId, ...parsed });
    }
    const response = await permissionApi.update(parsedId, parsed);
    return normalizePermission(response.data);
  });

const deletePermission = async (id) =>
  execute(async () => {
    const parsedId = parsePermissionId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.PERMISSIONS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizePermission({ id: parsedId });
    }
    const response = await permissionApi.remove(parsedId);
    return normalizePermission(response.data);
  });

export { listPermissions, getPermission, createPermission, updatePermission, deletePermission };
