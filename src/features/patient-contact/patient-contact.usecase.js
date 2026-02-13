/**
 * Patient Contact Use Cases
 * File: patient-contact.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { patientContactApi } from './patient-contact.api';
import { normalizePatientContact, normalizePatientContactList } from './patient-contact.model';
import {
  parsePatientContactId,
  parsePatientContactListParams,
  parsePatientContactPayload,
} from './patient-contact.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listPatientContacts = async (params = {}) =>
  execute(async () => {
    const parsed = parsePatientContactListParams(params);
    const response = await patientContactApi.list(parsed);
    return normalizePatientContactList(response.data);
  });

const getPatientContact = async (id) =>
  execute(async () => {
    const parsedId = parsePatientContactId(id);
    const response = await patientContactApi.get(parsedId);
    return normalizePatientContact(response.data);
  });

const createPatientContact = async (payload) =>
  execute(async () => {
    const parsed = parsePatientContactPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PATIENT_CONTACTS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizePatientContact(parsed);
    }
    const response = await patientContactApi.create(parsed);
    return normalizePatientContact(response.data);
  });

const updatePatientContact = async (id, payload) =>
  execute(async () => {
    const parsedId = parsePatientContactId(id);
    const parsed = parsePatientContactPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.PATIENT_CONTACTS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizePatientContact({ id: parsedId, ...parsed });
    }
    const response = await patientContactApi.update(parsedId, parsed);
    return normalizePatientContact(response.data);
  });

const deletePatientContact = async (id) =>
  execute(async () => {
    const parsedId = parsePatientContactId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.PATIENT_CONTACTS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizePatientContact({ id: parsedId });
    }
    await patientContactApi.remove(parsedId);
    return { id: parsedId };
  });

export {
  listPatientContacts,
  getPatientContact,
  createPatientContact,
  updatePatientContact,
  deletePatientContact,
};
