/**
 * Radiology Result API
 * File: radiology-result.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const radiologyResultApi = createCrudApi(endpoints.RADIOLOGY_RESULTS);
radiologyResultApi.signOff = (id, payload = {}) =>
  apiClient({
    url: endpoints.RADIOLOGY_RESULTS.SIGN_OFF(id),
    method: 'POST',
    body: payload,
  });

export { radiologyResultApi };
