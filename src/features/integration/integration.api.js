/**
 * Integration API
 * File: integration.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const integrationApi = createCrudApi(endpoints.INTEGRATIONS);
integrationApi.testConnection = (id, payload = {}) =>
  apiClient({
    url: endpoints.INTEGRATIONS.TEST_CONNECTION(id),
    method: 'POST',
    body: payload,
  });
integrationApi.syncNow = (id, payload = {}) =>
  apiClient({
    url: endpoints.INTEGRATIONS.SYNC_NOW(id),
    method: 'POST',
    body: payload,
  });

export { integrationApi };
