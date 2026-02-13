/**
 * usePatientGuardian Hook
 * CRUD binding for patient guardian feature.
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  createPatientGuardian,
  deletePatientGuardian,
  getPatientGuardian,
  listPatientGuardians,
  updatePatientGuardian,
} from '@features/patient-guardian';

const usePatientGuardian = () => {
  const actions = useMemo(
    () => ({
      list: listPatientGuardians,
      get: getPatientGuardian,
      create: createPatientGuardian,
      update: updatePatientGuardian,
      remove: deletePatientGuardian,
    }),
    []
  );

  return useCrud(actions);
};

export default usePatientGuardian;

