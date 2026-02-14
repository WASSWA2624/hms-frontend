/**
 * useRefund Hook
 * File: useRefund.js
 */
import useCrud from '@hooks/useCrud';
import {
  listRefunds,
  getRefund,
  createRefund,
  updateRefund,
  deleteRefund
} from '@features/refund';

const useRefund = () =>
  useCrud({
    list: listRefunds,
    get: getRefund,
    create: createRefund,
    update: updateRefund,
    remove: deleteRefund,
  });

export default useRefund;
