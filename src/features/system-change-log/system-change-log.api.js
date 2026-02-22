/**
 * System Change Log API
 * File: system-change-log.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const systemChangeLogApi = {
  list: (params = {}) =>
    apiClient({
      url: `${endpoints.SYSTEM_CHANGE_LOGS.LIST}${buildQueryString(params)}`,
      method: 'GET',
    }),
  get: (id) =>
    apiClient({
      url: endpoints.SYSTEM_CHANGE_LOGS.GET(id),
      method: 'GET',
    }),
  create: (payload) =>
    apiClient({
      url: endpoints.SYSTEM_CHANGE_LOGS.CREATE,
      method: 'POST',
      body: payload,
    }),
  update: (id, payload) =>
    apiClient({
      url: endpoints.SYSTEM_CHANGE_LOGS.UPDATE(id),
      method: 'PUT',
      body: payload,
    }),
  approve: (id, payload = {}) =>
    apiClient({
      url: endpoints.SYSTEM_CHANGE_LOGS.APPROVE(id),
      method: 'POST',
      body: payload,
    }),
  implement: (id, payload = {}) =>
    apiClient({
      url: endpoints.SYSTEM_CHANGE_LOGS.IMPLEMENT(id),
      method: 'POST',
      body: payload,
    }),
};

export { systemChangeLogApi };
