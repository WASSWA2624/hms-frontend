/**
 * API Key Permission Usecase Tests
 * File: api-key-permission.usecase.test.js
 */
import {
  listApiKeyPermissions,
  getApiKeyPermission,
  createApiKeyPermission,
  updateApiKeyPermission,
  deleteApiKeyPermission,
} from '@features/api-key-permission';
import { apiKeyPermissionApi } from '@features/api-key-permission/api-key-permission.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/api-key-permission/api-key-permission.api', () => ({
  apiKeyPermissionApi: {
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

describe('api-key-permission.usecase', () => {
  beforeEach(() => {
    apiKeyPermissionApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    apiKeyPermissionApi.get.mockResolvedValue({ data: { id: '1' } });
    apiKeyPermissionApi.create.mockResolvedValue({ data: { id: '1' } });
    apiKeyPermissionApi.update.mockResolvedValue({ data: { id: '1' } });
    apiKeyPermissionApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listApiKeyPermissions,
      get: getApiKeyPermission,
      create: createApiKeyPermission,
      update: updateApiKeyPermission,
      remove: deleteApiKeyPermission,
    },
    { queueRequestIfOffline }
  );
});
