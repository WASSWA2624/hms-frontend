/**
 * usePatientMedicalHistory Hook
 * CRUD binding for patient medical history feature.
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  createPatientMedicalHistory,
  deletePatientMedicalHistory,
  getPatientMedicalHistory,
  listPatientMedicalHistories,
  updatePatientMedicalHistory,
} from '@features/patient-medical-history';

const usePatientMedicalHistory = () => {
  const actions = useMemo(
    () => ({
      list: listPatientMedicalHistories,
      get: getPatientMedicalHistory,
      create: createPatientMedicalHistory,
      update: updatePatientMedicalHistory,
      remove: deletePatientMedicalHistory,
    }),
    []
  );

  return useCrud(actions);
};

export default usePatientMedicalHistory;

