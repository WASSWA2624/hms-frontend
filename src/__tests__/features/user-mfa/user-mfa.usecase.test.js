/**
 * User MFA Usecase Tests
 * File: user-mfa.usecase.test.js
 */
import {
  listUserMfas,
  getUserMfa,
  createUserMfa,
  updateUserMfa,
  deleteUserMfa,
  verifyUserMfa,
  enableUserMfa,
  disableUserMfa,
} from '@features/user-mfa';
import {
  userMfaApi,
  verifyUserMfaApi,
  enableUserMfaApi,
  disableUserMfaApi,
} from '@features/user-mfa/user-mfa.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/user-mfa/user-mfa.api', () => ({
  userMfaApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
  verifyUserMfaApi: jest.fn(),
  enableUserMfaApi: jest.fn(),
  disableUserMfaApi: jest.fn(),
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('user-mfa.usecase', () => {
  beforeEach(() => {
    userMfaApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    userMfaApi.get.mockResolvedValue({ data: { id: '1' } });
    userMfaApi.create.mockResolvedValue({ data: { id: '1' } });
    userMfaApi.update.mockResolvedValue({ data: { id: '1' } });
    userMfaApi.remove.mockResolvedValue({ data: { id: '1' } });
    verifyUserMfaApi.mockResolvedValue({ data: { id: '1' } });
    enableUserMfaApi.mockResolvedValue({ data: { id: '1' } });
    disableUserMfaApi.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listUserMfas,
      get: getUserMfa,
      create: createUserMfa,
      update: updateUserMfa,
      remove: deleteUserMfa,
    },
    { queueRequestIfOffline }
  );

  it('runs online verify/enable/disable', async () => {
    queueRequestIfOffline.mockResolvedValue(false);
    await expect(verifyUserMfa('1', { code: '123456' })).resolves.toBeDefined();
    await expect(enableUserMfa('1', { enabled: true })).resolves.toBeDefined();
    await expect(disableUserMfa('1', { enabled: false })).resolves.toBeDefined();
  });

  it('queues offline verify/enable/disable', async () => {
    queueRequestIfOffline.mockResolvedValue(true);
    await expect(verifyUserMfa('1', { code: '123456' })).resolves.toEqual({
      id: '1',
      code: '123456',
    });
    await expect(enableUserMfa('1', { enabled: true })).resolves.toEqual({
      id: '1',
      enabled: true,
    });
    await expect(disableUserMfa('1', { enabled: false })).resolves.toEqual({
      id: '1',
      enabled: false,
    });
  });
});
