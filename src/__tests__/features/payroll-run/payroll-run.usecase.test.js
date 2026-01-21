/**
 * Payroll Run Usecase Tests
 * File: payroll-run.usecase.test.js
 */
import { listPayrollRuns, getPayrollRun, createPayrollRun, updatePayrollRun, deletePayrollRun } from '@features/payroll-run';
import { payrollRunApi } from '@features/payroll-run/payroll-run.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/payroll-run/payroll-run.api', () => ({
  payrollRunApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('payroll-run.usecase', () => {
  beforeEach(() => {
    payrollRunApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    payrollRunApi.get.mockResolvedValue({ data: { id: '1' } });
    payrollRunApi.create.mockResolvedValue({ data: { id: '1' } });
    payrollRunApi.update.mockResolvedValue({ data: { id: '1' } });
    payrollRunApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listPayrollRuns,
      get: getPayrollRun,
      create: createPayrollRun,
      update: updatePayrollRun,
      remove: deletePayrollRun,
    },
    { queueRequestIfOffline }
  );
});
