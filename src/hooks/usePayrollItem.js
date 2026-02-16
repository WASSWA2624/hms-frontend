/**
 * usePayrollItem Hook
 * File: usePayrollItem.js
 */
import useCrud from '@hooks/useCrud';
import {
  listPayrollItems,
  getPayrollItem,
  createPayrollItem,
  updatePayrollItem,
  deletePayrollItem,
} from '@features/payroll-item';

const usePayrollItem = () =>
  useCrud({
    list: listPayrollItems,
    get: getPayrollItem,
    create: createPayrollItem,
    update: updatePayrollItem,
    remove: deletePayrollItem,
  });

export default usePayrollItem;
