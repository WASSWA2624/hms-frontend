/**
 * Patient API Tests
 * File: patient.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';
import { patientApi } from '@features/patient/patient.api';

const mockedCrudApi = {
  list: jest.fn(),
  get: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
  buildQueryString: jest.fn((params = {}) =>
    Object.keys(params).length ? '?page=1' : ''
  ),
  createCrudApi: jest.fn(() => mockedCrudApi),
}));

describe('patient.api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exposes patient api methods', () => {
    expect(patientApi).toEqual(
      expect.objectContaining({
        listIdentifiers: expect.any(Function),
        listContacts: expect.any(Function),
        listGuardians: expect.any(Function),
        listAllergies: expect.any(Function),
        listMedicalHistories: expect.any(Function),
        listDocuments: expect.any(Function),
      })
    );
  });

  it('lists patient nested subresources using mounted backend routes', async () => {
    await patientApi.listIdentifiers('patient-1', { page: 1 });
    await patientApi.listContacts('patient-1', { page: 1 });
    await patientApi.listGuardians('patient-1', { page: 1 });
    await patientApi.listAllergies('patient-1', { page: 1 });
    await patientApi.listMedicalHistories('patient-1', { page: 1 });
    await patientApi.listDocuments('patient-1', { page: 1 });

    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.PATIENTS.GET_IDENTIFIERS('patient-1')}?page=1`,
      method: 'GET',
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.PATIENTS.GET_CONTACTS('patient-1')}?page=1`,
      method: 'GET',
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.PATIENTS.GET_GUARDIANS('patient-1')}?page=1`,
      method: 'GET',
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.PATIENTS.GET_ALLERGIES('patient-1')}?page=1`,
      method: 'GET',
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.PATIENTS.GET_MEDICAL_HISTORIES('patient-1')}?page=1`,
      method: 'GET',
    });
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.PATIENTS.GET_DOCUMENTS('patient-1')}?page=1`,
      method: 'GET',
    });
    expect(buildQueryString).toHaveBeenCalled();
  });
});
