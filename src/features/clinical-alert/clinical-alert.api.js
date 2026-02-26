/**
 * Clinical Alert API
 * File: clinical-alert.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const clinicalAlertApi = createCrudApi(endpoints.CLINICAL_ALERTS);
clinicalAlertApi.acknowledge = (id, payload = {}) =>
  apiClient({
    url: endpoints.CLINICAL_ALERTS.ACKNOWLEDGE(id),
    method: 'POST',
    body: payload,
  });
clinicalAlertApi.resolve = (id, payload = {}) =>
  apiClient({
    url: endpoints.CLINICAL_ALERTS.RESOLVE(id),
    method: 'POST',
    body: payload,
  });

export { clinicalAlertApi };
