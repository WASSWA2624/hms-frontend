/**
 * Appointment Participant Model
 * File: appointment-participant.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeAppointmentParticipant = (value) => normalize(value);
const normalizeAppointmentParticipantList = (value) => normalizeList(value);

export { normalizeAppointmentParticipant, normalizeAppointmentParticipantList };
