/**
 * Appointment API
 * File: appointment.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';

const appointmentApi = createCrudApi(endpoints.APPOINTMENTS);
appointmentApi.cancel = (id, payload = {}) =>
  apiClient({
    url: endpoints.APPOINTMENTS.CANCEL(id),
    method: 'POST',
    body: payload,
  });

export { appointmentApi };
