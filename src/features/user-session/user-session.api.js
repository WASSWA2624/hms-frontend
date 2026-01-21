/**
 * User Session API
 * File: user-session.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const listUserSessionsApi = (params = {}) =>
  apiClient({
    url: `${endpoints.USER_SESSIONS.LIST}${buildQueryString(params)}`,
    method: 'GET',
  });

const getUserSessionApi = (id) =>
  apiClient({
    url: endpoints.USER_SESSIONS.GET(id),
    method: 'GET',
  });

const deleteUserSessionApi = (id) =>
  apiClient({
    url: endpoints.USER_SESSIONS.DELETE(id),
    method: 'DELETE',
  });

export { listUserSessionsApi, getUserSessionApi, deleteUserSessionApi };
