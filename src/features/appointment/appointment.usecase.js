/**
 * Appointment Use Cases
 * File: appointment.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { appointmentApi } from './appointment.api';
import { normalizeAppointment, normalizeAppointmentList } from './appointment.model';
import { parseAppointmentId, parseAppointmentListParams, parseAppointmentPayload } from './appointment.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listAppointments = async (params = {}) =>
  execute(async () => {
    const parsed = parseAppointmentListParams(params);
    const response = await appointmentApi.list(parsed);
    return normalizeAppointmentList(response.data);
  });

const getAppointment = async (id) =>
  execute(async () => {
    const parsedId = parseAppointmentId(id);
    const response = await appointmentApi.get(parsedId);
    return normalizeAppointment(response.data);
  });

const createAppointment = async (payload) =>
  execute(async () => {
    const parsed = parseAppointmentPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.APPOINTMENTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeAppointment(parsed);
    }
    const response = await appointmentApi.create(parsed);
    return normalizeAppointment(response.data);
  });

const updateAppointment = async (id, payload) =>
  execute(async () => {
    const parsedId = parseAppointmentId(id);
    const parsed = parseAppointmentPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.APPOINTMENTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeAppointment({ id: parsedId, ...parsed });
    }
    const response = await appointmentApi.update(parsedId, parsed);
    return normalizeAppointment(response.data);
  });

const deleteAppointment = async (id) =>
  execute(async () => {
    const parsedId = parseAppointmentId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.APPOINTMENTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeAppointment({ id: parsedId });
    }
    const response = await appointmentApi.remove(parsedId);
    return normalizeAppointment(response.data);
  });

export { listAppointments, getAppointment, createAppointment, updateAppointment, deleteAppointment };
