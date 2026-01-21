/**
 * Role Usecase Tests
 * File: role.usecase.test.js
 */
import { listRoles, getRole, createRole, updateRole, deleteRole } from '@features/role';
import { roleApi } from '@features/role/role.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/role/role.api', () => ({
  roleApi: {
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

describe('role.usecase', () => {
  beforeEach(() => {
    roleApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    roleApi.get.mockResolvedValue({ data: { id: '1' } });
    roleApi.create.mockResolvedValue({ data: { id: '1' } });
    roleApi.update.mockResolvedValue({ data: { id: '1' } });
    roleApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listRoles,
      get: getRole,
      create: createRole,
      update: updateRole,
      remove: deleteRole,
    },
    { queueRequestIfOffline }
  );
});
