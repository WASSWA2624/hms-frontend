/**
 * Staff Leave Usecase Tests
 * File: staff-leave.usecase.test.js
 */
import { listStaffLeaves, getStaffLeave, createStaffLeave, updateStaffLeave, deleteStaffLeave } from '@features/staff-leave';
import { staffLeaveApi } from '@features/staff-leave/staff-leave.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/staff-leave/staff-leave.api', () => ({
  staffLeaveApi: {
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

describe('staff-leave.usecase', () => {
  beforeEach(() => {
    staffLeaveApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    staffLeaveApi.get.mockResolvedValue({ data: { id: '1' } });
    staffLeaveApi.create.mockResolvedValue({ data: { id: '1' } });
    staffLeaveApi.update.mockResolvedValue({ data: { id: '1' } });
    staffLeaveApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listStaffLeaves,
      get: getStaffLeave,
      create: createStaffLeave,
      update: updateStaffLeave,
      remove: deleteStaffLeave,
    },
    { queueRequestIfOffline }
  );
});
