/**
 * Returns the CRUD hook state for the selected patient resource.
 */
import { useMemo } from 'react';
import {
  usePatient,
  usePatientIdentifier,
  usePatientContact,
  usePatientGuardian,
  usePatientAllergy,
  usePatientMedicalHistory,
  usePatientDocument,
} from '@hooks';
import { PATIENT_RESOURCE_IDS } from './patientResourceConfigs';

const usePatientResourceCrud = (resourceId) => {
  const patient = usePatient();
  const patientIdentifier = usePatientIdentifier();
  const patientContact = usePatientContact();
  const patientGuardian = usePatientGuardian();
  const patientAllergy = usePatientAllergy();
  const patientMedicalHistory = usePatientMedicalHistory();
  const patientDocument = usePatientDocument();

  return useMemo(() => {
    const map = {
      [PATIENT_RESOURCE_IDS.PATIENTS]: patient,
      [PATIENT_RESOURCE_IDS.PATIENT_IDENTIFIERS]: patientIdentifier,
      [PATIENT_RESOURCE_IDS.PATIENT_CONTACTS]: patientContact,
      [PATIENT_RESOURCE_IDS.PATIENT_GUARDIANS]: patientGuardian,
      [PATIENT_RESOURCE_IDS.PATIENT_ALLERGIES]: patientAllergy,
      [PATIENT_RESOURCE_IDS.PATIENT_MEDICAL_HISTORIES]: patientMedicalHistory,
      [PATIENT_RESOURCE_IDS.PATIENT_DOCUMENTS]: patientDocument,
    };
    return map[resourceId] || patient;
  }, [
    resourceId,
    patient,
    patientIdentifier,
    patientContact,
    patientGuardian,
    patientAllergy,
    patientMedicalHistory,
    patientDocument,
  ]);
};

export default usePatientResourceCrud;
