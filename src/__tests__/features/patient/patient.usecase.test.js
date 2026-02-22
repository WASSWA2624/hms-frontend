/**
 * Patient Usecase Tests
 * File: patient.usecase.test.js
 */
import {
  createPatient,
  deletePatient,
  getPatient,
  listPatientAllergies,
  listPatientContacts,
  listPatientDocuments,
  listPatientGuardians,
  listPatientIdentifiers,
  listPatientMedicalHistories,
  listPatients,
  updatePatient,
} from '@features/patient';
import { patientApi } from '@features/patient/patient.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/patient/patient.api', () => ({
  patientApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    listIdentifiers: jest.fn(),
    listContacts: jest.fn(),
    listGuardians: jest.fn(),
    listAllergies: jest.fn(),
    listMedicalHistories: jest.fn(),
    listDocuments: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('patient.usecase', () => {
  beforeEach(() => {
    patientApi.list.mockResolvedValue({
      data: [{ id: '1' }],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
    patientApi.get.mockResolvedValue({ data: { id: '1' } });
    patientApi.create.mockResolvedValue({ data: { id: '1' } });
    patientApi.update.mockResolvedValue({ data: { id: '1' } });
    patientApi.remove.mockResolvedValue({ data: { id: '1' } });
    patientApi.listIdentifiers.mockResolvedValue({ data: [{ id: 'identifier-1' }] });
    patientApi.listContacts.mockResolvedValue({ data: [{ id: 'contact-1' }] });
    patientApi.listGuardians.mockResolvedValue({ data: [{ id: 'guardian-1' }] });
    patientApi.listAllergies.mockResolvedValue({ data: [{ id: 'allergy-1' }] });
    patientApi.listMedicalHistories.mockResolvedValue({ data: [{ id: 'history-1' }] });
    patientApi.listDocuments.mockResolvedValue({ data: [{ id: 'document-1' }] });
  });

  runCrudUsecaseTests(
    {
      list: listPatients,
      get: getPatient,
      create: createPatient,
      update: updatePatient,
      remove: deletePatient,
    },
    { queueRequestIfOffline }
  );

  it('returns list response with items and pagination contract', async () => {
    await expect(listPatients({ page: 1, limit: 20 })).resolves.toEqual({
      items: [{ id: '1' }],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });

  it('lists mounted patient subresources', async () => {
    await expect(listPatientIdentifiers('1', { page: 1 })).resolves.toEqual([
      { id: 'identifier-1' },
    ]);
    await expect(listPatientContacts('1', { page: 1 })).resolves.toEqual([
      { id: 'contact-1' },
    ]);
    await expect(listPatientGuardians('1', { page: 1 })).resolves.toEqual([
      { id: 'guardian-1' },
    ]);
    await expect(listPatientAllergies('1', { page: 1 })).resolves.toEqual([
      { id: 'allergy-1' },
    ]);
    await expect(listPatientMedicalHistories('1', { page: 1 })).resolves.toEqual([
      { id: 'history-1' },
    ]);
    await expect(listPatientDocuments('1', { page: 1 })).resolves.toEqual([
      { id: 'document-1' },
    ]);
  });

  it('rejects invalid ids for patient subresource lists', async () => {
    await expect(listPatientIdentifiers(null)).rejects.toBeDefined();
    await expect(listPatientContacts(null)).rejects.toBeDefined();
    await expect(listPatientGuardians(null)).rejects.toBeDefined();
    await expect(listPatientAllergies(null)).rejects.toBeDefined();
    await expect(listPatientMedicalHistories(null)).rejects.toBeDefined();
    await expect(listPatientDocuments(null)).rejects.toBeDefined();
  });
});
