/**
 * useInsuranceClaim Hook
 * File: useInsuranceClaim.js
 */
import useCrud from '@hooks/useCrud';
import {
  listInsuranceClaims,
  getInsuranceClaim,
  createInsuranceClaim,
  updateInsuranceClaim,
  deleteInsuranceClaim
} from '@features/insurance-claim';

const useInsuranceClaim = () =>
  useCrud({
    list: listInsuranceClaims,
    get: getInsuranceClaim,
    create: createInsuranceClaim,
    update: updateInsuranceClaim,
    remove: deleteInsuranceClaim,
  });

export default useInsuranceClaim;
