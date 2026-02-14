/**
 * usePayrollRun Hook
 * File: usePayrollRun.js
 */
import useCrud from '@hooks/useCrud';
import {
  listPayrollRuns,
  getPayrollRun,
  createPayrollRun,
  updatePayrollRun,
  deletePayrollRun
} from '@features/payroll-run';

const usePayrollRun = () =>
  useCrud({
    list: listPayrollRuns,
    get: getPayrollRun,
    create: createPayrollRun,
    update: updatePayrollRun,
    remove: deletePayrollRun,
  });

export default usePayrollRun;
