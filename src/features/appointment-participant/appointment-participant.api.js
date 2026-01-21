/**
 * Appointment Participant API
 * File: appointment-participant.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const appointmentParticipantApi = createCrudApi(endpoints.APPOINTMENT_PARTICIPANTS);

export { appointmentParticipantApi };
