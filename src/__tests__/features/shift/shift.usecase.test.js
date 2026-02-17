/**
 * Shift Usecase Tests
 * File: shift.usecase.test.js
 */
import { publishShift, listShifts, getShift, createShift, updateShift, deleteShift } from '@features/shift';
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
    publish: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('shift.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    shiftApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    shiftApi.get.mockResolvedValue({ data: { id: '1' } });
    shiftApi.create.mockResolvedValue({ data: { id: '1' } });
    shiftApi.update.mockResolvedValue({ data: { id: '1' } });
    shiftApi.remove.mockResolvedValue({ data: { id: '1' } });
    shiftApi.publish.mockResolvedValue({ data: { id: '1', status: 'PUBLISHED' } });
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

  it('publishes shift', async () => {
    await expect(publishShift('1', { notify_staff: true })).resolves.toMatchObject({
      id: '1',
      status: 'PUBLISHED',
    });
    expect(shiftApi.publish).toHaveBeenCalledWith('1', { notify_staff: true });
  });

  it('publishes shift with default payload', async () => {
    await expect(publishShift('1')).resolves.toMatchObject({
      id: '1',
      status: 'PUBLISHED',
    });
    expect(shiftApi.publish).toHaveBeenCalledWith('1', {});
  });

  it('rejects invalid id for publish', async () => {
    await expect(publishShift(null, { notify_staff: true })).rejects.toBeDefined();
  });
});
