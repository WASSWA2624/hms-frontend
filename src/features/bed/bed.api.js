/**
 * Bed API
 * File: bed.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const bedApi = createCrudApi(endpoints.BEDS);

export { bedApi };
