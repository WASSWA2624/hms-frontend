/**
 * Patient Use Cases
 * File: patient.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { patientApi } from './patient.api';
import { normalizePatient, normalizePatientList } from './patient.model';
import { parsePatientId, parsePatientListParams, parsePatientPayload } from './patient.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listPatients = async (params = {}) =>
  execute(async () => {
    const parsed = parsePatientListParams(params);
    const response = await patientApi.list(parsed);
    return normalizePatientList(response.data);
  });

const getPatient = async (id) =>
  execute(async () => {
    const parsedId = parsePatientId(id);
    const response = await patientApi.get(parsedId);
    return normalizePatient(response.data);
  });

const createPatient = async (payload) =>
  execute(async () => {
    const parsed = parsePatientPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PATIENTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizePatient(parsed);
    }
    const response = await patientApi.create(parsed);
    return normalizePatient(response.data);
  });

const updatePatient = async (id, payload) =>
  execute(async () => {
    const parsedId = parsePatientId(id);
    const parsed = parsePatientPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PATIENTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizePatient({ id: parsedId, ...parsed });
    }
    const response = await patientApi.update(parsedId, parsed);
    return normalizePatient(response.data);
  });

const deletePatient = async (id) =>
  execute(async () => {
    const parsedId = parsePatientId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.PATIENTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizePatient({ id: parsedId });
    }
    await patientApi.remove(parsedId);
    return { id: parsedId };
  });

export { listPatients, getPatient, createPatient, updatePatient, deletePatient };
