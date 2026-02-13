/**
 * Patient Document Use Cases
 * File: patient-document.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { patientDocumentApi } from './patient-document.api';
import { normalizePatientDocument, normalizePatientDocumentList } from './patient-document.model';
import {
  parsePatientDocumentId,
  parsePatientDocumentListParams,
  parsePatientDocumentPayload,
} from './patient-document.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listPatientDocuments = async (params = {}) =>
  execute(async () => {
    const parsed = parsePatientDocumentListParams(params);
    const response = await patientDocumentApi.list(parsed);
    return normalizePatientDocumentList(response.data);
  });

const getPatientDocument = async (id) =>
  execute(async () => {
    const parsedId = parsePatientDocumentId(id);
    const response = await patientDocumentApi.get(parsedId);
    return normalizePatientDocument(response.data);
  });

const createPatientDocument = async (payload) =>
  execute(async () => {
    const parsed = parsePatientDocumentPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PATIENT_DOCUMENTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizePatientDocument(parsed);
    }
    const response = await patientDocumentApi.create(parsed);
    return normalizePatientDocument(response.data);
  });

const updatePatientDocument = async (id, payload) =>
  execute(async () => {
    const parsedId = parsePatientDocumentId(id);
    const parsed = parsePatientDocumentPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PATIENT_DOCUMENTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizePatientDocument({ id: parsedId, ...parsed });
    }
    const response = await patientDocumentApi.update(parsedId, parsed);
    return normalizePatientDocument(response.data);
  });

const deletePatientDocument = async (id) =>
  execute(async () => {
    const parsedId = parsePatientDocumentId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.PATIENT_DOCUMENTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizePatientDocument({ id: parsedId });
    }
    await patientDocumentApi.remove(parsedId);
    return { id: parsedId };
  });

export {
  listPatientDocuments,
  getPatientDocument,
  createPatientDocument,
  updatePatientDocument,
  deletePatientDocument,
};
