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
  deletePayment,
  reconcilePayment,
  getPaymentChannelBreakdown,
} from '@features/payment';

const usePayment = () =>
  useCrud({
    list: listPayments,
    get: getPayment,
    create: createPayment,
    update: updatePayment,
    remove: deletePayment,
    reconcile: reconcilePayment,
    channelBreakdown: getPaymentChannelBreakdown,
  });

export default usePayment;
