/**
 * Shift API
 * File: shift.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const shiftApi = createCrudApi(endpoints.SHIFTS);
shiftApi.publish = (id, payload = {}) =>
  apiClient({
    url: endpoints.SHIFTS.PUBLISH(id),
    method: 'POST',
    body: payload,
  });

export { shiftApi };
