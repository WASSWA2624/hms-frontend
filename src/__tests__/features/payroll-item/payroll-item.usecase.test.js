/**
 * Payroll Item Usecase Tests
 * File: payroll-item.usecase.test.js
 */
import { listPayrollItems, getPayrollItem, createPayrollItem, updatePayrollItem, deletePayrollItem } from '@features/payroll-item';
import { payrollItemApi } from '@features/payroll-item/payroll-item.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/payroll-item/payroll-item.api', () => ({
  payrollItemApi: {
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

describe('payroll-item.usecase', () => {
  beforeEach(() => {
    payrollItemApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    payrollItemApi.get.mockResolvedValue({ data: { id: '1' } });
    payrollItemApi.create.mockResolvedValue({ data: { id: '1' } });
    payrollItemApi.update.mockResolvedValue({ data: { id: '1' } });
    payrollItemApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listPayrollItems,
      get: getPayrollItem,
      create: createPayrollItem,
      update: updatePayrollItem,
      remove: deletePayrollItem,
    },
    { queueRequestIfOffline }
  );
});
