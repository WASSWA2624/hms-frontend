/**
 * usePatientAllergy Hook
 * CRUD binding for patient allergy feature.
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  createPatientAllergy,
  deletePatientAllergy,
  getPatientAllergy,
  listPatientAllergies,
  updatePatientAllergy,
} from '@features/patient-allergy';

const usePatientAllergy = () => {
  const actions = useMemo(
    () => ({
      list: listPatientAllergies,
      get: getPatientAllergy,
      create: createPatientAllergy,
      update: updatePatientAllergy,
      remove: deletePatientAllergy,
    }),
    []
  );

  return useCrud(actions);
};

export default usePatientAllergy;

