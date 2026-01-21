/**
 * Staff Assignment Usecase Tests
 * File: staff-assignment.usecase.test.js
 */
import {
  listStaffAssignments,
  getStaffAssignment,
  createStaffAssignment,
  updateStaffAssignment,
  deleteStaffAssignment,
} from '@features/staff-assignment';
import { staffAssignmentApi } from '@features/staff-assignment/staff-assignment.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/staff-assignment/staff-assignment.api', () => ({
  staffAssignmentApi: {
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

describe('staff-assignment.usecase', () => {
  beforeEach(() => {
    staffAssignmentApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    staffAssignmentApi.get.mockResolvedValue({ data: { id: '1' } });
    staffAssignmentApi.create.mockResolvedValue({ data: { id: '1' } });
    staffAssignmentApi.update.mockResolvedValue({ data: { id: '1' } });
    staffAssignmentApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listStaffAssignments,
      get: getStaffAssignment,
      create: createStaffAssignment,
      update: updateStaffAssignment,
      remove: deleteStaffAssignment,
    },
    { queueRequestIfOffline }
  );
});
