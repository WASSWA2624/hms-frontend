/**
 * Clinical Term API
 * File: clinical-term.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const clinicalTermApi = {
  suggestions: (params = {}) =>
    apiClient({
      url: `${endpoints.CLINICAL_TERMS.SUGGESTIONS}${buildQueryString(params)}`,
      method: 'GET',
    }),
  listFavorites: (params = {}) =>
    apiClient({
      url: `${endpoints.CLINICAL_TERM_FAVORITES.LIST}${buildQueryString(params)}`,
      method: 'GET',
    }),
  createFavorite: (payload = {}) =>
    apiClient({
      url: endpoints.CLINICAL_TERM_FAVORITES.CREATE,
      method: 'POST',
      body: payload,
    }),
  deleteFavorite: (id) =>
    apiClient({
      url: endpoints.CLINICAL_TERM_FAVORITES.DELETE(id),
      method: 'DELETE',
    }),
};

export { clinicalTermApi };
