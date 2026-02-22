/**
 * useSubscriptionInvoice Hook
 * File: useSubscriptionInvoice.js
 */
import useCrud from '@hooks/useCrud';
import {
  collectSubscriptionInvoice,
  createSubscriptionInvoice,
  deleteSubscriptionInvoice,
  getSubscriptionInvoice,
  listSubscriptionInvoices,
  retrySubscriptionInvoice,
  updateSubscriptionInvoice,
} from '@features/subscription-invoice';

const useSubscriptionInvoice = () =>
  useCrud({
    list: listSubscriptionInvoices,
    get: getSubscriptionInvoice,
    create: createSubscriptionInvoice,
    update: updateSubscriptionInvoice,
    remove: deleteSubscriptionInvoice,
    collect: collectSubscriptionInvoice,
    retry: retrySubscriptionInvoice,
  });

export default useSubscriptionInvoice;
