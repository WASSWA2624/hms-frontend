/**
 * Unit API
 * File: unit.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const unitApi = createCrudApi(endpoints.UNITS);

export { unitApi };
