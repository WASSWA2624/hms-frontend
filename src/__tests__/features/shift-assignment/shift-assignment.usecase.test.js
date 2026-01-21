/**
 * Shift Assignment Usecase Tests
 * File: shift-assignment.usecase.test.js
 */
import {
  listShiftAssignments,
  getShiftAssignment,
  createShiftAssignment,
  updateShiftAssignment,
  deleteShiftAssignment,
} from '@features/shift-assignment';
import { shiftAssignmentApi } from '@features/shift-assignment/shift-assignment.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/shift-assignment/shift-assignment.api', () => ({
  shiftAssignmentApi: {
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

describe('shift-assignment.usecase', () => {
  beforeEach(() => {
    shiftAssignmentApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    shiftAssignmentApi.get.mockResolvedValue({ data: { id: '1' } });
    shiftAssignmentApi.create.mockResolvedValue({ data: { id: '1' } });
    shiftAssignmentApi.update.mockResolvedValue({ data: { id: '1' } });
    shiftAssignmentApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listShiftAssignments,
      get: getShiftAssignment,
      create: createShiftAssignment,
      update: updateShiftAssignment,
      remove: deleteShiftAssignment,
    },
    { queueRequestIfOffline }
  );
});
