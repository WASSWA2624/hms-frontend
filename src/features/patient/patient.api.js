/**
 * Patient API
 * File: patient.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString, createCrudApi } from '@services/api';

const patientCrudApi = createCrudApi(endpoints.PATIENTS);

const listPatientSubresource = (url, params = {}) =>
  apiClient({
    url: `${url}${buildQueryString(params)}`,
    method: 'GET',
  });

const patientApi = {
  ...patientCrudApi,
  listIdentifiers: (id, params = {}) =>
    listPatientSubresource(endpoints.PATIENTS.GET_IDENTIFIERS(id), params),
  listContacts: (id, params = {}) =>
    listPatientSubresource(endpoints.PATIENTS.GET_CONTACTS(id), params),
  listGuardians: (id, params = {}) =>
    listPatientSubresource(endpoints.PATIENTS.GET_GUARDIANS(id), params),
  listAllergies: (id, params = {}) =>
    listPatientSubresource(endpoints.PATIENTS.GET_ALLERGIES(id), params),
  listMedicalHistories: (id, params = {}) =>
    listPatientSubresource(endpoints.PATIENTS.GET_MEDICAL_HISTORIES(id), params),
  listDocuments: (id, params = {}) =>
    listPatientSubresource(endpoints.PATIENTS.GET_DOCUMENTS(id), params),
};

export { patientApi };
