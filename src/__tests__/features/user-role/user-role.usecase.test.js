/**
 * User Role Usecase Tests
 * File: user-role.usecase.test.js
 */
import { listUserRoles, getUserRole, createUserRole, updateUserRole, deleteUserRole } from '@features/user-role';
import { userRoleApi } from '@features/user-role/user-role.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/user-role/user-role.api', () => ({
  userRoleApi: {
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

describe('user-role.usecase', () => {
  beforeEach(() => {
    userRoleApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    userRoleApi.get.mockResolvedValue({ data: { id: '1' } });
    userRoleApi.create.mockResolvedValue({ data: { id: '1' } });
    userRoleApi.update.mockResolvedValue({ data: { id: '1' } });
    userRoleApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listUserRoles,
      get: getUserRole,
      create: createUserRole,
      update: updateUserRole,
      remove: deleteUserRole,
    },
    { queueRequestIfOffline }
  );
});
