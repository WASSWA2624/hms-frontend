/**
 * Department Usecase Tests
 * File: department.usecase.test.js
 */
import {
  listDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  listDepartmentUnits,
} from '@features/department';
import { departmentApi, getDepartmentUnitsApi } from '@features/department/department.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/department/department.api', () => ({
  departmentApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
  getDepartmentUnitsApi: jest.fn(),
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('department.usecase', () => {
  beforeEach(() => {
    departmentApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    departmentApi.get.mockResolvedValue({ data: { id: '1' } });
    departmentApi.create.mockResolvedValue({ data: { id: '1' } });
    departmentApi.update.mockResolvedValue({ data: { id: '1' } });
    departmentApi.remove.mockResolvedValue({ data: { id: '1' } });
    getDepartmentUnitsApi.mockResolvedValue({ data: [{ id: '1' }] });
  });

  runCrudUsecaseTests(
    {
      list: listDepartments,
      get: getDepartment,
      create: createDepartment,
      update: updateDepartment,
      remove: deleteDepartment,
      extraActions: [{ fn: listDepartmentUnits, args: ['1'] }],
    },
    { queueRequestIfOffline }
  );
});
