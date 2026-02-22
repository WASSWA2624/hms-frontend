/**
 * Discharge Summary API
 * File: discharge-summary.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const dischargeSummaryApi = createCrudApi(endpoints.DISCHARGE_SUMMARIES);
dischargeSummaryApi.finalize = (id, payload = {}) =>
  apiClient({
    url: endpoints.DISCHARGE_SUMMARIES.FINALIZE(id),
    method: 'POST',
    body: payload,
  });

export { dischargeSummaryApi };
