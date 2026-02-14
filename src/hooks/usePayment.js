/**
 * usePayment Hook
 * File: usePayment.js
 */
import useCrud from '@hooks/useCrud';
import {
  listPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment
} from '@features/payment';

const usePayment = () =>
  useCrud({
    list: listPayments,
    get: getPayment,
    create: createPayment,
    update: updatePayment,
    remove: deletePayment,
  });

export default usePayment;
