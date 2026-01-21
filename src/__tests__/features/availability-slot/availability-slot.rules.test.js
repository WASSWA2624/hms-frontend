/**
 * Availability Slot Rules Tests
 * File: availability-slot.rules.test.js
 */
import {
  parseAvailabilitySlotId,
  parseAvailabilitySlotListParams,
  parseAvailabilitySlotPayload,
} from '@features/availability-slot';
import { expectIdParser, expectListParamsParser, expectPayloadParser } from '../../helpers/crud-assertions';

describe('availability-slot.rules', () => {
  it('parses ids', () => {
    expectIdParser(parseAvailabilitySlotId);
  });

  it('parses payloads', () => {
    expectPayloadParser(parseAvailabilitySlotPayload);
  });

  it('parses list params', () => {
    expectListParamsParser(parseAvailabilitySlotListParams);
  });
});
