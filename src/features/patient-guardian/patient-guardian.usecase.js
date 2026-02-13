/**
 * Patient Guardian Use Cases
 * File: patient-guardian.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { patientGuardianApi } from './patient-guardian.api';
import { normalizePatientGuardian, normalizePatientGuardianList } from './patient-guardian.model';
import {
  parsePatientGuardianId,
  parsePatientGuardianListParams,
  parsePatientGuardianPayload,
} from './patient-guardian.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listPatientGuardians = async (params = {}) =>
  execute(async () => {
    const parsed = parsePatientGuardianListParams(params);
    const response = await patientGuardianApi.list(parsed);
    return normalizePatientGuardianList(response.data);
  });

const getPatientGuardian = async (id) =>
  execute(async () => {
    const parsedId = parsePatientGuardianId(id);
    const response = await patientGuardianApi.get(parsedId);
    return normalizePatientGuardian(response.data);
  });

const createPatientGuardian = async (payload) =>
  execute(async () => {
    const parsed = parsePatientGuardianPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PATIENT_GUARDIANS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizePatientGuardian(parsed);
    }
    const response = await patientGuardianApi.create(parsed);
    return normalizePatientGuardian(response.data);
  });

const updatePatientGuardian = async (id, payload) =>
  execute(async () => {
    const parsedId = parsePatientGuardianId(id);
    const parsed = parsePatientGuardianPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PATIENT_GUARDIANS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizePatientGuardian({ id: parsedId, ...parsed });
    }
    const response = await patientGuardianApi.update(parsedId, parsed);
    return normalizePatientGuardian(response.data);
  });

const deletePatientGuardian = async (id) =>
  execute(async () => {
    const parsedId = parsePatientGuardianId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.PATIENT_GUARDIANS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizePatientGuardian({ id: parsedId });
    }
    await patientGuardianApi.remove(parsedId);
    return { id: parsedId };
  });

export {
  listPatientGuardians,
  getPatientGuardian,
  createPatientGuardian,
  updatePatientGuardian,
  deletePatientGuardian,
};
