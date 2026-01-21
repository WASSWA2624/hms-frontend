/**
 * Shift Swap Request Usecase Tests
 * File: shift-swap-request.usecase.test.js
 */
import {
  listShiftSwapRequests,
  getShiftSwapRequest,
  createShiftSwapRequest,
  updateShiftSwapRequest,
  deleteShiftSwapRequest,
} from '@features/shift-swap-request';
import { shiftSwapRequestApi } from '@features/shift-swap-request/shift-swap-request.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/shift-swap-request/shift-swap-request.api', () => ({
  shiftSwapRequestApi: {
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

describe('shift-swap-request.usecase', () => {
  beforeEach(() => {
    shiftSwapRequestApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    shiftSwapRequestApi.get.mockResolvedValue({ data: { id: '1' } });
    shiftSwapRequestApi.create.mockResolvedValue({ data: { id: '1' } });
    shiftSwapRequestApi.update.mockResolvedValue({ data: { id: '1' } });
    shiftSwapRequestApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listShiftSwapRequests,
      get: getShiftSwapRequest,
      create: createShiftSwapRequest,
      update: updateShiftSwapRequest,
      remove: deleteShiftSwapRequest,
    },
    { queueRequestIfOffline }
  );
});
