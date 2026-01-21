/**
 * Shift Usecase Tests
 * File: shift.usecase.test.js
 */
import { listShifts, getShift, createShift, updateShift, deleteShift } from '@features/shift';
import { shiftApi } from '@features/shift/shift.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/shift/shift.api', () => ({
  shiftApi: {
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

describe('shift.usecase', () => {
  beforeEach(() => {
    shiftApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    shiftApi.get.mockResolvedValue({ data: { id: '1' } });
    shiftApi.create.mockResolvedValue({ data: { id: '1' } });
    shiftApi.update.mockResolvedValue({ data: { id: '1' } });
    shiftApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listShifts,
      get: getShift,
      create: createShift,
      update: updateShift,
      remove: deleteShift,
    },
    { queueRequestIfOffline }
  );
});
