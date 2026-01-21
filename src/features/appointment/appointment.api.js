/**
 * Appointment API
 * File: appointment.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const appointmentApi = createCrudApi(endpoints.APPOINTMENTS);

export { appointmentApi };
