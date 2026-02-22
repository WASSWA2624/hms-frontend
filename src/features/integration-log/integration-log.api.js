/**
 * Integration Log API
 * File: integration-log.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const integrationLogApi = {
  list: (params = {}) =>
    apiClient({
      url: `${endpoints.INTEGRATION_LOGS.LIST}${buildQueryString(params)}`,
      method: 'GET',
    }),
  get: (id) =>
    apiClient({
      url: endpoints.INTEGRATION_LOGS.GET(id),
      method: 'GET',
    }),
  listByIntegration: (integrationId, params = {}) =>
    apiClient({
      url: `${endpoints.INTEGRATION_LOGS.GET_BY_INTEGRATION(integrationId)}${buildQueryString(params)}`,
      method: 'GET',
    }),
  replay: (id, payload = {}) =>
    apiClient({
      url: endpoints.INTEGRATION_LOGS.REPLAY(id),
      method: 'POST',
      body: payload,
    }),
};

export { integrationLogApi };
