/**
 * User Session Use Cases
 * File: user-session.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { deleteUserSessionApi, getUserSessionApi, listUserSessionsApi } from './user-session.api';
import { normalizeUserSession, normalizeUserSessionList } from './user-session.model';
import { parseUserSessionId, parseUserSessionListParams } from './user-session.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listUserSessions = async (params = {}) =>
  execute(async () => {
    const parsed = parseUserSessionListParams(params);
    const response = await listUserSessionsApi(parsed);
    return normalizeUserSessionList(response.data);
  });

const getUserSession = async (id) =>
  execute(async () => {
    const parsedId = parseUserSessionId(id);
    const response = await getUserSessionApi(parsedId);
    return normalizeUserSession(response.data);
  });

const revokeUserSession = async (id) =>
  execute(async () => {
    const parsedId = parseUserSessionId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.USER_SESSIONS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeUserSession({ id: parsedId });
    }
    const response = await deleteUserSessionApi(parsedId);
    return normalizeUserSession(response.data);
  });

export { listUserSessions, getUserSession, revokeUserSession };
