/**
 * Staff Profile API
 * File: staff-profile.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const staffProfileApi = createCrudApi(endpoints.STAFF_PROFILES);

export { staffProfileApi };
