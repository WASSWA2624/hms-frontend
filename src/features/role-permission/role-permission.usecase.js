/**
 * Role Permission Use Cases
 * File: role-permission.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { rolePermissionApi } from './role-permission.api';
import { normalizeRolePermission, normalizeRolePermissionList } from './role-permission.model';
import {
  parseRolePermissionId,
  parseRolePermissionListParams,
  parseRolePermissionPayload,
} from './role-permission.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listRolePermissions = async (params = {}) =>
  execute(async () => {
    const parsed = parseRolePermissionListParams(params);
    const response = await rolePermissionApi.list(parsed);
    return normalizeRolePermissionList(response.data);
  });

const getRolePermission = async (id) =>
  execute(async () => {
    const parsedId = parseRolePermissionId(id);
    const response = await rolePermissionApi.get(parsedId);
    return normalizeRolePermission(response.data);
  });

const createRolePermission = async (payload) =>
  execute(async () => {
    const parsed = parseRolePermissionPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.ROLE_PERMISSIONS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeRolePermission(parsed);
    }
    const response = await rolePermissionApi.create(parsed);
    return normalizeRolePermission(response.data);
  });

const updateRolePermission = async (id, payload) =>
  execute(async () => {
    const parsedId = parseRolePermissionId(id);
    const parsed = parseRolePermissionPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.ROLE_PERMISSIONS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeRolePermission({ id: parsedId, ...parsed });
    }
    const response = await rolePermissionApi.update(parsedId, parsed);
    return normalizeRolePermission(response.data);
  });

const deleteRolePermission = async (id) =>
  execute(async () => {
    const parsedId = parseRolePermissionId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.ROLE_PERMISSIONS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeRolePermission({ id: parsedId });
    }
    const response = await rolePermissionApi.remove(parsedId);
    return normalizeRolePermission(response.data);
  });

export {
  listRolePermissions,
  getRolePermission,
  createRolePermission,
  updateRolePermission,
  deleteRolePermission,
};
