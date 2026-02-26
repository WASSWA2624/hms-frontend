/**
 * Clinical Alert Threshold API
 * File: clinical-alert-threshold.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const clinicalAlertThresholdApi = {
  get: (params = {}) =>
    apiClient({
      url: `${endpoints.CLINICAL_ALERT_THRESHOLDS.GET}${buildQueryString(params)}`,
      method: 'GET',
    }),
  update: (payload = {}) =>
    apiClient({
      url: endpoints.CLINICAL_ALERT_THRESHOLDS.UPDATE,
      method: 'PUT',
      body: payload,
    }),
};

export { clinicalAlertThresholdApi };
