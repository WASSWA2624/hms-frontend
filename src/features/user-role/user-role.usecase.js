/**
 * User Role Use Cases
 * File: user-role.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { userRoleApi } from './user-role.api';
import { normalizeUserRole, normalizeUserRoleList } from './user-role.model';
import { parseUserRoleId, parseUserRoleListParams, parseUserRolePayload } from './user-role.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listUserRoles = async (params = {}) =>
  execute(async () => {
    const parsed = parseUserRoleListParams(params);
    const response = await userRoleApi.list(parsed);
    return normalizeUserRoleList(response.data);
  });

const getUserRole = async (id) =>
  execute(async () => {
    const parsedId = parseUserRoleId(id);
    const response = await userRoleApi.get(parsedId);
    return normalizeUserRole(response.data);
  });

const createUserRole = async (payload) =>
  execute(async () => {
    const parsed = parseUserRolePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.USER_ROLES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeUserRole(parsed);
    }
    const response = await userRoleApi.create(parsed);
    return normalizeUserRole(response.data);
  });

const updateUserRole = async (id, payload) =>
  execute(async () => {
    const parsedId = parseUserRoleId(id);
    const parsed = parseUserRolePayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.USER_ROLES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeUserRole({ id: parsedId, ...parsed });
    }
    const response = await userRoleApi.update(parsedId, parsed);
    return normalizeUserRole(response.data);
  });

const deleteUserRole = async (id) =>
  execute(async () => {
    const parsedId = parseUserRoleId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.USER_ROLES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeUserRole({ id: parsedId });
    }
    const response = await userRoleApi.remove(parsedId);
    return normalizeUserRole(response.data);
  });

export { listUserRoles, getUserRole, createUserRole, updateUserRole, deleteUserRole };
