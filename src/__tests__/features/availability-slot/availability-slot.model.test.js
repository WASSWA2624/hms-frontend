/**
 * Availability Slot Model Tests
 * File: availability-slot.model.test.js
 */
import { normalizeAvailabilitySlot, normalizeAvailabilitySlotList } from '@features/availability-slot';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('availability-slot.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeAvailabilitySlot, normalizeAvailabilitySlotList);
  });
});
