/**
 * Audit Log API
 * File: audit-log.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const auditLogApi = {
  list: (params = {}) =>
    apiClient({
      url: `${endpoints.AUDIT_LOGS.LIST}${buildQueryString(params)}`,
      method: 'GET',
    }),
  get: (id) =>
    apiClient({
      url: endpoints.AUDIT_LOGS.GET(id),
      method: 'GET',
    }),
};

export { auditLogApi };
