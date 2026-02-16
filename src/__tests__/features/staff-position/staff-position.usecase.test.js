/**
 * Staff Position Usecase Tests
 * File: staff-position.usecase.test.js
 */
import {
  listStaffPositions,
  getStaffPosition,
  createStaffPosition,
  updateStaffPosition,
  deleteStaffPosition,
} from '@features/staff-position';
import { staffPositionApi } from '@features/staff-position/staff-position.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/staff-position/staff-position.api', () => ({
  staffPositionApi: {
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

describe('staff-position.usecase', () => {
  beforeEach(() => {
    staffPositionApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    staffPositionApi.get.mockResolvedValue({ data: { id: '1' } });
    staffPositionApi.create.mockResolvedValue({ data: { id: '1' } });
    staffPositionApi.update.mockResolvedValue({ data: { id: '1' } });
    staffPositionApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listStaffPositions,
      get: getStaffPosition,
      create: createStaffPosition,
      update: updateStaffPosition,
      remove: deleteStaffPosition,
    },
    { queueRequestIfOffline }
  );
});

