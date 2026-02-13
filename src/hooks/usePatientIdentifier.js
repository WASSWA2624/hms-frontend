/**
 * usePatientIdentifier Hook
 * CRUD binding for patient identifier feature.
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  createPatientIdentifier,
  deletePatientIdentifier,
  getPatientIdentifier,
  listPatientIdentifiers,
  updatePatientIdentifier,
} from '@features/patient-identifier';

const usePatientIdentifier = () => {
  const actions = useMemo(
    () => ({
      list: listPatientIdentifiers,
      get: getPatientIdentifier,
      create: createPatientIdentifier,
      update: updatePatientIdentifier,
      remove: deletePatientIdentifier,
    }),
    []
  );

  return useCrud(actions);
};

export default usePatientIdentifier;

