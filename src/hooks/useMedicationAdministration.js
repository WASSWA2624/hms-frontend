/**
 * useMedicationAdministration Hook
 * File: useMedicationAdministration.js
 */
import useCrud from '@hooks/useCrud';
import {
  createMedicationAdministration,
  deleteMedicationAdministration,
  getMedicationAdministration,
  listMedicationAdministrations,
  updateMedicationAdministration,
} from '@features/medication-administration';

const useMedicationAdministration = () =>
  useCrud({
    list: listMedicationAdministrations,
    get: getMedicationAdministration,
    create: createMedicationAdministration,
    update: updateMedicationAdministration,
    remove: deleteMedicationAdministration,
  });

export default useMedicationAdministration;
