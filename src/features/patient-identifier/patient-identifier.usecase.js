/**
 * Patient Identifier Use Cases
 * File: patient-identifier.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { patientIdentifierApi } from './patient-identifier.api';
import { normalizePatientIdentifier, normalizePatientIdentifierList } from './patient-identifier.model';
import {
  parsePatientIdentifierId,
  parsePatientIdentifierListParams,
  parsePatientIdentifierPayload,
} from './patient-identifier.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listPatientIdentifiers = async (params = {}) =>
  execute(async () => {
    const parsed = parsePatientIdentifierListParams(params);
    const response = await patientIdentifierApi.list(parsed);
    return normalizePatientIdentifierList(response.data);
  });

const getPatientIdentifier = async (id) =>
  execute(async () => {
    const parsedId = parsePatientIdentifierId(id);
    const response = await patientIdentifierApi.get(parsedId);
    return normalizePatientIdentifier(response.data);
  });

const createPatientIdentifier = async (payload) =>
  execute(async () => {
    const parsed = parsePatientIdentifierPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PATIENT_IDENTIFIERS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizePatientIdentifier(parsed);
    }
    const response = await patientIdentifierApi.create(parsed);
    return normalizePatientIdentifier(response.data);
  });

const updatePatientIdentifier = async (id, payload) =>
  execute(async () => {
    const parsedId = parsePatientIdentifierId(id);
    const parsed = parsePatientIdentifierPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PATIENT_IDENTIFIERS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizePatientIdentifier({ id: parsedId, ...parsed });
    }
    const response = await patientIdentifierApi.update(parsedId, parsed);
    return normalizePatientIdentifier(response.data);
  });

const deletePatientIdentifier = async (id) =>
  execute(async () => {
    const parsedId = parsePatientIdentifierId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.PATIENT_IDENTIFIERS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizePatientIdentifier({ id: parsedId });
    }
    await patientIdentifierApi.remove(parsedId);
    return { id: parsedId };
  });

export {
  listPatientIdentifiers,
  getPatientIdentifier,
  createPatientIdentifier,
  updatePatientIdentifier,
  deletePatientIdentifier,
};
