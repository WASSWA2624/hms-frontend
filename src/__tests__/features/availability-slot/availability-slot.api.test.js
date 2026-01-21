/**
 * Availability Slot API Tests
 * File: availability-slot.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';
import { availabilitySlotApi } from '@features/availability-slot/availability-slot.api';

jest.mock('@services/api', () => ({
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('availability-slot.api', () => {
  it('creates crud api with availability slot endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.AVAILABILITY_SLOTS);
    expect(availabilitySlotApi).toBeDefined();
  });
});
