/**
 * useAdmission Hook
 * File: useAdmission.js
 */
import useCrud from '@hooks/useCrud';
import {
  createAdmission,
  dischargeAdmission,
  deleteAdmission,
  getAdmission,
  listAdmissions,
  transferAdmission,
  updateAdmission,
} from '@features/admission';

const useAdmission = () =>
  useCrud({
    list: listAdmissions,
    get: getAdmission,
    create: createAdmission,
    update: updateAdmission,
    remove: deleteAdmission,
    discharge: dischargeAdmission,
    transfer: transferAdmission,
  });

export default useAdmission;
