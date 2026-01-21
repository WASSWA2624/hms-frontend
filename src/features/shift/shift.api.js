/**
 * Shift API
 * File: shift.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const shiftApi = createCrudApi(endpoints.SHIFTS);

export { shiftApi };
