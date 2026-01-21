/**
 * Tenant API
 * File: tenant.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const tenantApi = createCrudApi(endpoints.TENANTS);

export { tenantApi };
