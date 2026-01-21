/**
 * Role Use Cases
 * File: role.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { roleApi } from './role.api';
import { normalizeRole, normalizeRoleList } from './role.model';
import { parseRoleId, parseRoleListParams, parseRolePayload } from './role.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listRoles = async (params = {}) =>
  execute(async () => {
    const parsed = parseRoleListParams(params);
    const response = await roleApi.list(parsed);
    return normalizeRoleList(response.data);
  });

const getRole = async (id) =>
  execute(async () => {
    const parsedId = parseRoleId(id);
    const response = await roleApi.get(parsedId);
    return normalizeRole(response.data);
  });

const createRole = async (payload) =>
  execute(async () => {
    const parsed = parseRolePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.ROLES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeRole(parsed);
    }
    const response = await roleApi.create(parsed);
    return normalizeRole(response.data);
  });

const updateRole = async (id, payload) =>
  execute(async () => {
    const parsedId = parseRoleId(id);
    const parsed = parseRolePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.ROLES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeRole({ id: parsedId, ...parsed });
    }
    const response = await roleApi.update(parsedId, parsed);
    return normalizeRole(response.data);
  });

const deleteRole = async (id) =>
  execute(async () => {
    const parsedId = parseRoleId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.ROLES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeRole({ id: parsedId });
    }
    const response = await roleApi.remove(parsedId);
    return normalizeRole(response.data);
  });

export { listRoles, getRole, createRole, updateRole, deleteRole };
