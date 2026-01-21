/**
 * Staff Leave API
 * File: staff-leave.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const staffLeaveApi = createCrudApi(endpoints.STAFF_LEAVES);

export { staffLeaveApi };
