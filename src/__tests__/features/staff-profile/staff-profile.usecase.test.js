/**
 * Staff Profile Usecase Tests
 * File: staff-profile.usecase.test.js
 */
import {
  listStaffProfiles,
  getStaffProfile,
  createStaffProfile,
  updateStaffProfile,
  deleteStaffProfile,
} from '@features/staff-profile';
import { staffProfileApi } from '@features/staff-profile/staff-profile.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/staff-profile/staff-profile.api', () => ({
  staffProfileApi: {
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

describe('staff-profile.usecase', () => {
  beforeEach(() => {
    staffProfileApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    staffProfileApi.get.mockResolvedValue({ data: { id: '1' } });
    staffProfileApi.create.mockResolvedValue({ data: { id: '1' } });
    staffProfileApi.update.mockResolvedValue({ data: { id: '1' } });
    staffProfileApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listStaffProfiles,
      get: getStaffProfile,
      create: createStaffProfile,
      update: updateStaffProfile,
      remove: deleteStaffProfile,
    },
    { queueRequestIfOffline }
  );
});
