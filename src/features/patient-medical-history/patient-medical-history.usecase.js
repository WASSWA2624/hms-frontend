/**
 * Patient Medical History Use Cases
 * File: patient-medical-history.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { patientMedicalHistoryApi } from './patient-medical-history.api';
import {
  normalizePatientMedicalHistory,
  normalizePatientMedicalHistoryList,
} from './patient-medical-history.model';
import {
  parsePatientMedicalHistoryId,
  parsePatientMedicalHistoryListParams,
  parsePatientMedicalHistoryPayload,
} from './patient-medical-history.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listPatientMedicalHistories = async (params = {}) =>
  execute(async () => {
    const parsed = parsePatientMedicalHistoryListParams(params);
    const response = await patientMedicalHistoryApi.list(parsed);
    return normalizePatientMedicalHistoryList(response.data);
  });

const getPatientMedicalHistory = async (id) =>
  execute(async () => {
    const parsedId = parsePatientMedicalHistoryId(id);
    const response = await patientMedicalHistoryApi.get(parsedId);
    return normalizePatientMedicalHistory(response.data);
  });

const createPatientMedicalHistory = async (payload) =>
  execute(async () => {
    const parsed = parsePatientMedicalHistoryPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PATIENT_MEDICAL_HISTORIES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizePatientMedicalHistory(parsed);
    }
    const response = await patientMedicalHistoryApi.create(parsed);
    return normalizePatientMedicalHistory(response.data);
  });

const updatePatientMedicalHistory = async (id, payload) =>
  execute(async () => {
    const parsedId = parsePatientMedicalHistoryId(id);
    const parsed = parsePatientMedicalHistoryPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PATIENT_MEDICAL_HISTORIES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizePatientMedicalHistory({ id: parsedId, ...parsed });
    }
    const response = await patientMedicalHistoryApi.update(parsedId, parsed);
    return normalizePatientMedicalHistory(response.data);
  });

const deletePatientMedicalHistory = async (id) =>
  execute(async () => {
    const parsedId = parsePatientMedicalHistoryId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.PATIENT_MEDICAL_HISTORIES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizePatientMedicalHistory({ id: parsedId });
    }
    await patientMedicalHistoryApi.remove(parsedId);
    return { id: parsedId };
  });

export {
  listPatientMedicalHistories,
  getPatientMedicalHistory,
  createPatientMedicalHistory,
  updatePatientMedicalHistory,
  deletePatientMedicalHistory,
};
