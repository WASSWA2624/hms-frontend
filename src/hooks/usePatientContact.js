/**
 * usePatientContact Hook
 * CRUD binding for patient contact feature.
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  createPatientContact,
  deletePatientContact,
  getPatientContact,
  listPatientContacts,
  updatePatientContact,
} from '@features/patient-contact';

const usePatientContact = () => {
  const actions = useMemo(
    () => ({
      list: listPatientContacts,
      get: getPatientContact,
      create: createPatientContact,
      update: updatePatientContact,
      remove: deletePatientContact,
    }),
    []
  );

  return useCrud(actions);
};

export default usePatientContact;

