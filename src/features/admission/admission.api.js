/**
 * Admission API
 * File: admission.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const admissionApi = createCrudApi(endpoints.ADMISSIONS);
admissionApi.discharge = (id, payload = {}) =>
  apiClient({
    url: endpoints.ADMISSIONS.DISCHARGE(id),
    method: 'POST',
    body: payload,
  });

export { admissionApi };
