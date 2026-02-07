/**
 * Staff Availability Usecase Tests
 * File: staff-availability.usecase.test.js
 */
import {
  listStaffAvailabilities,
  getStaffAvailability,
  createStaffAvailability,
  updateStaffAvailability,
  deleteStaffAvailability,
} from '@features/staff-availability';
import { staffAvailabilityApi } from '@features/staff-availability/staff-availability.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/staff-availability/staff-availability.api', () => ({
  staffAvailabilityApi: {
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

describe('staff-availability.usecase', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    staffAvailabilityApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    staffAvailabilityApi.get.mockResolvedValue({ data: { id: '1' } });
    staffAvailabilityApi.create.mockResolvedValue({ data: { id: '1' } });
    staffAvailabilityApi.update.mockResolvedValue({ data: { id: '1' } });
    staffAvailabilityApi.remove.mockResolvedValue({ data: null, status: 204 });
  });

  afterEach(() => {
    consoleErrorSpy?.mockRestore?.();
  });

  runCrudUsecaseTests(
    {
      list: listStaffAvailabilities,
      get: getStaffAvailability,
      create: createStaffAvailability,
      update: updateStaffAvailability,
      remove: deleteStaffAvailability,
    },
    { queueRequestIfOffline }
  );
});

