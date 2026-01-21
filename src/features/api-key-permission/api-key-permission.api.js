/**
 * API Key Permission API
 * File: api-key-permission.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const apiKeyPermissionApi = createCrudApi(endpoints.API_KEY_PERMISSIONS);

export { apiKeyPermissionApi };
