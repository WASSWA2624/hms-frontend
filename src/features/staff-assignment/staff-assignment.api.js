/**
 * Staff Assignment API
 * File: staff-assignment.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const staffAssignmentApi = createCrudApi(endpoints.STAFF_ASSIGNMENTS);

export { staffAssignmentApi };
