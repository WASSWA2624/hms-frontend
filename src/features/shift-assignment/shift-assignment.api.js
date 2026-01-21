/**
 * Shift Assignment API
 * File: shift-assignment.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const shiftAssignmentApi = createCrudApi(endpoints.SHIFT_ASSIGNMENTS);

export { shiftAssignmentApi };
