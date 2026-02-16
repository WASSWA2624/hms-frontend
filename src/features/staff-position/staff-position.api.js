/**
 * Staff Position API
 * File: staff-position.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const staffPositionApi = createCrudApi(endpoints.STAFF_POSITIONS);

export { staffPositionApi };

