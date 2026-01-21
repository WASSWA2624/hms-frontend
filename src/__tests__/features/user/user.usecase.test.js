/**
 * User Usecase Tests
 * File: user.usecase.test.js
 */
import { listUsers, getUser, createUser, updateUser, deleteUser } from '@features/user';
import { userApi } from '@features/user/user.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/user/user.api', () => ({
  userApi: {
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

describe('user.usecase', () => {
  beforeEach(() => {
    userApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    userApi.get.mockResolvedValue({ data: { id: '1' } });
    userApi.create.mockResolvedValue({ data: { id: '1' } });
    userApi.update.mockResolvedValue({ data: { id: '1' } });
    userApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listUsers,
      get: getUser,
      create: createUser,
      update: updateUser,
      remove: deleteUser,
    },
    { queueRequestIfOffline }
  );
});
