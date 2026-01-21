/**
 * User Use Cases
 * File: user.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { userApi } from './user.api';
import { normalizeUser, normalizeUserList } from './user.model';
import { parseUserId, parseUserListParams, parseUserPayload } from './user.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listUsers = async (params = {}) =>
  execute(async () => {
    const parsed = parseUserListParams(params);
    const response = await userApi.list(parsed);
    return normalizeUserList(response.data);
  });

const getUser = async (id) =>
  execute(async () => {
    const parsedId = parseUserId(id);
    const response = await userApi.get(parsedId);
    return normalizeUser(response.data);
  });

const createUser = async (payload) =>
  execute(async () => {
    const parsed = parseUserPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.USERS.LIST,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeUser(parsed);
    }
    const response = await userApi.create(parsed);
    return normalizeUser(response.data);
  });

const updateUser = async (id, payload) =>
  execute(async () => {
    const parsedId = parseUserId(id);
    const parsed = parseUserPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.USERS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeUser({ id: parsedId, ...parsed });
    }
    const response = await userApi.update(parsedId, parsed);
    return normalizeUser(response.data);
  });

const deleteUser = async (id) =>
  execute(async () => {
    const parsedId = parseUserId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.USERS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeUser({ id: parsedId });
    }
    const response = await userApi.remove(parsedId);
    return normalizeUser(response.data);
  });

export { listUsers, getUser, createUser, updateUser, deleteUser };
