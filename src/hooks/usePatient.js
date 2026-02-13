/**
 * usePatient Hook
 * CRUD binding for patient feature.
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import { createPatient, deletePatient, getPatient, listPatients, updatePatient } from '@features/patient';

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

  return useCrud(actions);
};

export default usePatient;

