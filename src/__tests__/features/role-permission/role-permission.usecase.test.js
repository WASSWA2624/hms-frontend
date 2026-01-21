/**
 * Role Permission Usecase Tests
 * File: role-permission.usecase.test.js
 */
import {
  listRolePermissions,
  getRolePermission,
  createRolePermission,
  updateRolePermission,
  deleteRolePermission,
} from '@features/role-permission';
import { rolePermissionApi } from '@features/role-permission/role-permission.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/role-permission/role-permission.api', () => ({
  rolePermissionApi: {
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

describe('role-permission.usecase', () => {
  beforeEach(() => {
    rolePermissionApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    rolePermissionApi.get.mockResolvedValue({ data: { id: '1' } });
    rolePermissionApi.create.mockResolvedValue({ data: { id: '1' } });
    rolePermissionApi.update.mockResolvedValue({ data: { id: '1' } });
    rolePermissionApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listRolePermissions,
      get: getRolePermission,
      create: createRolePermission,
      update: updateRolePermission,
      remove: deleteRolePermission,
    },
    { queueRequestIfOffline }
  );
});
