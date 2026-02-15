/**
 * Terms Acceptance API
 * File: terms-acceptance.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const termsAcceptanceApi = {
  list: (params = {}) =>
    apiClient({
      url: `${endpoints.TERMS_ACCEPTANCES.LIST}${buildQueryString(params)}`,
      method: 'GET',
    }),
  get: (id) =>
    apiClient({
      url: endpoints.TERMS_ACCEPTANCES.GET(id),
      method: 'GET',
    }),
  create: (payload) =>
    apiClient({
      url: endpoints.TERMS_ACCEPTANCES.CREATE,
      method: 'POST',
      body: payload,
    }),
  remove: (id) =>
    apiClient({
      url: endpoints.TERMS_ACCEPTANCES.DELETE(id),
      method: 'DELETE',
    }),
};

export { termsAcceptanceApi };
