/**
 * useInvoice Hook
 * File: useInvoice.js
 */
import useCrud from '@hooks/useCrud';
import {
  listInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice
} from '@features/invoice';

const useInvoice = () =>
  useCrud({
    list: listInvoices,
    get: getInvoice,
    create: createInvoice,
    update: updateInvoice,
    remove: deleteInvoice,
  });

export default useInvoice;
