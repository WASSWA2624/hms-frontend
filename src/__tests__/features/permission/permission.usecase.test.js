/**
 * Permission Usecase Tests
 * File: permission.usecase.test.js
 */
import { listPermissions, getPermission, createPermission, updatePermission, deletePermission } from '@features/permission';
import { permissionApi } from '@features/permission/permission.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/permission/permission.api', () => ({
  permissionApi: {
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

describe('permission.usecase', () => {
  beforeEach(() => {
    permissionApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    permissionApi.get.mockResolvedValue({ data: { id: '1' } });
    permissionApi.create.mockResolvedValue({ data: { id: '1' } });
    permissionApi.update.mockResolvedValue({ data: { id: '1' } });
    permissionApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listPermissions,
      get: getPermission,
      create: createPermission,
      update: updatePermission,
      remove: deletePermission,
    },
    { queueRequestIfOffline }
  );
});
