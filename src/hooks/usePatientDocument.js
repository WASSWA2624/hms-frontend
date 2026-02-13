/**
 * usePatientDocument Hook
 * CRUD binding for patient document feature.
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  createPatientDocument,
  deletePatientDocument,
  getPatientDocument,
  listPatientDocuments,
  updatePatientDocument,
} from '@features/patient-document';

const usePatientDocument = () => {
  const actions = useMemo(
    () => ({
      list: listPatientDocuments,
      get: getPatientDocument,
      create: createPatientDocument,
      update: updatePatientDocument,
      remove: deletePatientDocument,
    }),
    []
  );

  return useCrud(actions);
};

export default usePatientDocument;

