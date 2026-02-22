/**
 * PHI Access Log API
 * File: phi-access-log.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const phiAccessLogApi = {
  list: (params = {}) =>
    apiClient({
      url: `${endpoints.PHI_ACCESS_LOGS.LIST}${buildQueryString(params)}`,
      method: 'GET',
    }),
  get: (id) =>
    apiClient({
      url: endpoints.PHI_ACCESS_LOGS.GET(id),
      method: 'GET',
    }),
  create: (payload) =>
    apiClient({
      url: endpoints.PHI_ACCESS_LOGS.CREATE,
      method: 'POST',
      body: payload,
    }),
  listByUser: (userId, params = {}) =>
    apiClient({
      url: `${endpoints.PHI_ACCESS_LOGS.GET_BY_USER(userId)}${buildQueryString(params)}`,
      method: 'GET',
    }),
};

export { phiAccessLogApi };
