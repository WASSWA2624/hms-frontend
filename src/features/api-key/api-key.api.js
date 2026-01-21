/**
 * API Key API
 * File: api-key.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const apiKeyApi = createCrudApi(endpoints.API_KEYS);

export { apiKeyApi };
