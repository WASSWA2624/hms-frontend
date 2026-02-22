/**
 * usePatient Hook
 * CRUD binding for patient feature.
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
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

const usePatient = () => {
  const actions = useMemo(
    () => ({
      list: listPatients,
      get: getPatient,
      create: createPatient,
      update: updatePatient,
      remove: deletePatient,
    }),
    []
  );

  const relatedActions = useMemo(
    () => ({
      listIdentifiers: listPatientIdentifiers,
      listContacts: listPatientContacts,
      listGuardians: listPatientGuardians,
      listAllergies: listPatientAllergies,
      listMedicalHistories: listPatientMedicalHistories,
      listDocuments: listPatientDocuments,
    }),
    []
  );

  return {
    ...useCrud(actions),
    ...relatedActions,
  };
};

export default usePatient;
