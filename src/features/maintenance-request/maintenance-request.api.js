/**
 * Maintenance Request API
 * File: maintenance-request.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const maintenanceRequestApi = createCrudApi(endpoints.MAINTENANCE_REQUESTS);
maintenanceRequestApi.triage = (id, payload = {}) =>
  apiClient({
    url: endpoints.MAINTENANCE_REQUESTS.TRIAGE(id),
    method: 'POST',
    body: payload,
  });

export { maintenanceRequestApi };
