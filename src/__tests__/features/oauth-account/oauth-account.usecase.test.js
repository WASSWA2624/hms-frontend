/**
 * OAuth Account Usecase Tests
 * File: oauth-account.usecase.test.js
 */
import {
  listOauthAccounts,
  getOauthAccount,
  createOauthAccount,
  updateOauthAccount,
  deleteOauthAccount,
} from '@features/oauth-account';
import { oauthAccountApi } from '@features/oauth-account/oauth-account.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/oauth-account/oauth-account.api', () => ({
  oauthAccountApi: {
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

describe('oauth-account.usecase', () => {
  beforeEach(() => {
    oauthAccountApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    oauthAccountApi.get.mockResolvedValue({ data: { id: '1' } });
    oauthAccountApi.create.mockResolvedValue({ data: { id: '1' } });
    oauthAccountApi.update.mockResolvedValue({ data: { id: '1' } });
    oauthAccountApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listOauthAccounts,
      get: getOauthAccount,
      create: createOauthAccount,
      update: updateOauthAccount,
      remove: deleteOauthAccount,
    },
    { queueRequestIfOffline }
  );
});
