/**
 * Patient Allergy Use Cases
 * File: patient-allergy.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { patientAllergyApi } from './patient-allergy.api';
import { normalizePatientAllergy, normalizePatientAllergyList } from './patient-allergy.model';
import {
  parsePatientAllergyId,
  parsePatientAllergyListParams,
  parsePatientAllergyPayload,
} from './patient-allergy.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listPatientAllergies = async (params = {}) =>
  execute(async () => {
    const parsed = parsePatientAllergyListParams(params);
    const response = await patientAllergyApi.list(parsed);
    return normalizePatientAllergyList(response.data);
  });

const getPatientAllergy = async (id) =>
  execute(async () => {
    const parsedId = parsePatientAllergyId(id);
    const response = await patientAllergyApi.get(parsedId);
    return normalizePatientAllergy(response.data);
  });

const createPatientAllergy = async (payload) =>
  execute(async () => {
    const parsed = parsePatientAllergyPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PATIENT_ALLERGIES.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizePatientAllergy(parsed);
    }
    const response = await patientAllergyApi.create(parsed);
    return normalizePatientAllergy(response.data);
  });

const updatePatientAllergy = async (id, payload) =>
  execute(async () => {
    const parsedId = parsePatientAllergyId(id);
    const parsed = parsePatientAllergyPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PATIENT_ALLERGIES.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizePatientAllergy({ id: parsedId, ...parsed });
    }
    const response = await patientAllergyApi.update(parsedId, parsed);
    return normalizePatientAllergy(response.data);
  });

const deletePatientAllergy = async (id) =>
  execute(async () => {
    const parsedId = parsePatientAllergyId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.PATIENT_ALLERGIES.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizePatientAllergy({ id: parsedId });
    }
    await patientAllergyApi.remove(parsedId);
    return { id: parsedId };
  });

export {
  listPatientAllergies,
  getPatientAllergy,
  createPatientAllergy,
  updatePatientAllergy,
  deletePatientAllergy,
};
