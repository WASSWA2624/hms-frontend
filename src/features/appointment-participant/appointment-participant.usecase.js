/**
 * Appointment Participant Use Cases
 * File: appointment-participant.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { appointmentParticipantApi } from './appointment-participant.api';
import {
  normalizeAppointmentParticipant,
  normalizeAppointmentParticipantList,
} from './appointment-participant.model';
import {
  parseAppointmentParticipantId,
  parseAppointmentParticipantListParams,
  parseAppointmentParticipantPayload,
} from './appointment-participant.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listAppointmentParticipants = async (params = {}) =>
  execute(async () => {
    const parsed = parseAppointmentParticipantListParams(params);
    const response = await appointmentParticipantApi.list(parsed);
    return normalizeAppointmentParticipantList(response.data);
  });

const getAppointmentParticipant = async (id) =>
  execute(async () => {
    const parsedId = parseAppointmentParticipantId(id);
    const response = await appointmentParticipantApi.get(parsedId);
    return normalizeAppointmentParticipant(response.data);
  });

const createAppointmentParticipant = async (payload) =>
  execute(async () => {
    const parsed = parseAppointmentParticipantPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.APPOINTMENT_PARTICIPANTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeAppointmentParticipant(parsed);
    }
    const response = await appointmentParticipantApi.create(parsed);
    return normalizeAppointmentParticipant(response.data);
  });

const updateAppointmentParticipant = async (id, payload) =>
  execute(async () => {
    const parsedId = parseAppointmentParticipantId(id);
    const parsed = parseAppointmentParticipantPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.APPOINTMENT_PARTICIPANTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeAppointmentParticipant({ id: parsedId, ...parsed });
    }
    const response = await appointmentParticipantApi.update(parsedId, parsed);
    return normalizeAppointmentParticipant(response.data);
  });

const deleteAppointmentParticipant = async (id) =>
  execute(async () => {
    const parsedId = parseAppointmentParticipantId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.APPOINTMENT_PARTICIPANTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeAppointmentParticipant({ id: parsedId });
    }
    const response = await appointmentParticipantApi.remove(parsedId);
    return normalizeAppointmentParticipant(response.data);
  });

export {
  listAppointmentParticipants,
  getAppointmentParticipant,
  createAppointmentParticipant,
  updateAppointmentParticipant,
  deleteAppointmentParticipant,
};
