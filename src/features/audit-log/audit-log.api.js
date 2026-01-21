/**
 * Audit Log API
 * File: audit-log.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const auditLogApi = createCrudApi(endpoints.AUDIT_LOGS);

export { auditLogApi };
