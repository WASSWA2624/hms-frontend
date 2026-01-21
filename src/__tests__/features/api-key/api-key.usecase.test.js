/**
 * API Key Usecase Tests
 * File: api-key.usecase.test.js
 */
import { listApiKeys, getApiKey, createApiKey, updateApiKey, deleteApiKey } from '@features/api-key';
import { apiKeyApi } from '@features/api-key/api-key.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/api-key/api-key.api', () => ({
  apiKeyApi: {
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

describe('api-key.usecase', () => {
  beforeEach(() => {
    apiKeyApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    apiKeyApi.get.mockResolvedValue({ data: { id: '1' } });
    apiKeyApi.create.mockResolvedValue({ data: { id: '1' } });
    apiKeyApi.update.mockResolvedValue({ data: { id: '1' } });
    apiKeyApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listApiKeys,
      get: getApiKey,
      create: createApiKey,
      update: updateApiKey,
      remove: deleteApiKey,
    },
    { queueRequestIfOffline }
  );
});
