/**
 * User Session Usecase Tests
 * File: user-session.usecase.test.js
 */
import { listUserSessions, getUserSession, revokeUserSession } from '@features/user-session';
import {
  listUserSessionsApi,
  getUserSessionApi,
  deleteUserSessionApi,
} from '@features/user-session/user-session.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/user-session/user-session.api', () => ({
  listUserSessionsApi: jest.fn(),
  getUserSessionApi: jest.fn(),
  deleteUserSessionApi: jest.fn(),
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('user-session.usecase', () => {
  beforeEach(() => {
    listUserSessionsApi.mockResolvedValue({ data: [{ id: '1' }] });
    getUserSessionApi.mockResolvedValue({ data: { id: '1' } });
    deleteUserSessionApi.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listUserSessions,
      get: getUserSession,
      remove: revokeUserSession,
    },
    { queueRequestIfOffline }
  );
});
