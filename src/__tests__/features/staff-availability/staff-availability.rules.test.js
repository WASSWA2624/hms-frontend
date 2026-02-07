/**
 * Staff Availability Rules Tests
 * File: staff-availability.rules.test.js
 */
import {
  parseStaffAvailabilityId,
  parseStaffAvailabilityListParams,
  parseStaffAvailabilityPayload,
} from '@features/staff-availability';

describe('staff-availability.rules', () => {
  it('parses ids', () => {
    expect(parseStaffAvailabilityId('1')).toBe('1');
    expect(parseStaffAvailabilityId(1)).toBe(1);
  });

  it('rejects invalid ids', () => {
    expect(() => parseStaffAvailabilityId(null)).toThrow();
    expect(() => parseStaffAvailabilityId('')).toThrow();
  });

  it('parses payloads', () => {
    expect(parseStaffAvailabilityPayload(null)).toEqual({});
    expect(parseStaffAvailabilityPayload({ staff_id: '1', is_available: true })).toEqual({
      staff_id: '1',
      is_available: true,
    });
  });

  it('parses list params', () => {
    expect(parseStaffAvailabilityListParams(null)).toEqual({});
    expect(parseStaffAvailabilityListParams({ page: 1, limit: 10, order: 'asc' })).toEqual({
      page: 1,
      limit: 10,
      order: 'asc',
    });
    expect(() => parseStaffAvailabilityListParams({ order: 'nope' })).toThrow();
  });
});

