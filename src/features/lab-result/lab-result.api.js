/**
 * Lab Result API
 * File: lab-result.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const labResultApi = createCrudApi(endpoints.LAB_RESULTS);
labResultApi.release = (id, payload = {}) =>
  apiClient({
    url: endpoints.LAB_RESULTS.RELEASE(id),
    method: 'POST',
    body: payload,
  });

export { labResultApi };
