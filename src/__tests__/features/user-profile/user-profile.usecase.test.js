/**
 * User Profile Usecase Tests
 * File: user-profile.usecase.test.js
 */
import {
  listUserProfiles,
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from '@features/user-profile';
import { userProfileApi } from '@features/user-profile/user-profile.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/user-profile/user-profile.api', () => ({
  userProfileApi: {
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

describe('user-profile.usecase', () => {
  beforeEach(() => {
    userProfileApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    userProfileApi.get.mockResolvedValue({ data: { id: '1' } });
    userProfileApi.create.mockResolvedValue({ data: { id: '1' } });
    userProfileApi.update.mockResolvedValue({ data: { id: '1' } });
    userProfileApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listUserProfiles,
      get: getUserProfile,
      create: createUserProfile,
      update: updateUserProfile,
      remove: deleteUserProfile,
    },
    { queueRequestIfOffline }
  );
});
