/**
 * Appointment Model
 * File: appointment.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeAppointment = (value) => normalize(value);
const normalizeAppointmentList = (value) => normalizeList(value);

export { normalizeAppointment, normalizeAppointmentList };
