/**
 * User MFA Use Cases
 * File: user-mfa.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { disableUserMfaApi, enableUserMfaApi, userMfaApi, verifyUserMfaApi } from './user-mfa.api';
import { normalizeUserMfa, normalizeUserMfaList } from './user-mfa.model';
import { parseUserMfaId, parseUserMfaListParams, parseUserMfaPayload } from './user-mfa.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listUserMfas = async (params = {}) =>
  execute(async () => {
    const parsed = parseUserMfaListParams(params);
    const response = await userMfaApi.list(parsed);
    return normalizeUserMfaList(response.data);
  });

const getUserMfa = async (id) =>
  execute(async () => {
    const parsedId = parseUserMfaId(id);
    const response = await userMfaApi.get(parsedId);
    return normalizeUserMfa(response.data);
  });

const createUserMfa = async (payload) =>
  execute(async () => {
    const parsed = parseUserMfaPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.USER_MFAS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeUserMfa(parsed);
    }
    const response = await userMfaApi.create(parsed);
    return normalizeUserMfa(response.data);
  });

const updateUserMfa = async (id, payload) =>
  execute(async () => {
    const parsedId = parseUserMfaId(id);
    const parsed = parseUserMfaPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.USER_MFAS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeUserMfa({ id: parsedId, ...parsed });
    }
    const response = await userMfaApi.update(parsedId, parsed);
    return normalizeUserMfa(response.data);
  });

const deleteUserMfa = async (id) =>
  execute(async () => {
    const parsedId = parseUserMfaId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.USER_MFAS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeUserMfa({ id: parsedId });
    }
    const response = await userMfaApi.remove(parsedId);
    return normalizeUserMfa(response.data);
  });

const verifyUserMfa = async (id, payload) =>
  execute(async () => {
    const parsedId = parseUserMfaId(id);
    const parsed = parseUserMfaPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.USER_MFAS.VERIFY(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeUserMfa({ id: parsedId, ...parsed });
    }
    const response = await verifyUserMfaApi(parsedId, parsed);
    return normalizeUserMfa(response.data);
  });

const enableUserMfa = async (id, payload) =>
  execute(async () => {
    const parsedId = parseUserMfaId(id);
    const parsed = parseUserMfaPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.USER_MFAS.ENABLE(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeUserMfa({ id: parsedId, ...parsed });
    }
    const response = await enableUserMfaApi(parsedId, parsed);
    return normalizeUserMfa(response.data);
  });

const disableUserMfa = async (id, payload) =>
  execute(async () => {
    const parsedId = parseUserMfaId(id);
    const parsed = parseUserMfaPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.USER_MFAS.DISABLE(parsedId),
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeUserMfa({ id: parsedId, ...parsed });
    }
    const response = await disableUserMfaApi(parsedId, parsed);
    return normalizeUserMfa(response.data);
  });

export {
  listUserMfas,
  getUserMfa,
  createUserMfa,
  updateUserMfa,
  deleteUserMfa,
  verifyUserMfa,
  enableUserMfa,
  disableUserMfa,
};
