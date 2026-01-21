/**
 * Availability Slot Usecase Tests
 * File: availability-slot.usecase.test.js
 */
import {
  listAvailabilitySlots,
  getAvailabilitySlot,
  createAvailabilitySlot,
  updateAvailabilitySlot,
  deleteAvailabilitySlot,
} from '@features/availability-slot';
import { availabilitySlotApi } from '@features/availability-slot/availability-slot.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/availability-slot/availability-slot.api', () => ({
  availabilitySlotApi: {
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

describe('availability-slot.usecase', () => {
  beforeEach(() => {
    availabilitySlotApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    availabilitySlotApi.get.mockResolvedValue({ data: { id: '1' } });
    availabilitySlotApi.create.mockResolvedValue({ data: { id: '1' } });
    availabilitySlotApi.update.mockResolvedValue({ data: { id: '1' } });
    availabilitySlotApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listAvailabilitySlots,
      get: getAvailabilitySlot,
      create: createAvailabilitySlot,
      update: updateAvailabilitySlot,
      remove: deleteAvailabilitySlot,
    },
    { queueRequestIfOffline }
  );
});
