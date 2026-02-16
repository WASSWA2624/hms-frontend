/**
 * useInvoiceItem Hook
 * File: useInvoiceItem.js
 */
import useCrud from '@hooks/useCrud';
import {
  listInvoiceItems,
  getInvoiceItem,
  createInvoiceItem,
  updateInvoiceItem,
  deleteInvoiceItem,
} from '@features/invoice-item';

const useInvoiceItem = () =>
  useCrud({
    list: listInvoiceItems,
    get: getInvoiceItem,
    create: createInvoiceItem,
    update: updateInvoiceItem,
    remove: deleteInvoiceItem,
  });

export default useInvoiceItem;
