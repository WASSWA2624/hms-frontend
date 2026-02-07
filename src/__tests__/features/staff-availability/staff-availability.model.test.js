/**
 * Staff Availability Model Tests
 * File: staff-availability.model.test.js
 */
import { normalizeStaffAvailability, normalizeStaffAvailabilityList } from '@features/staff-availability';

describe('staff-availability.model', () => {
  it('normalizes single item', () => {
    expect(normalizeStaffAvailability(null)).toBeNull();
    expect(normalizeStaffAvailability({ id: '1', staff_id: '2' })).toEqual({ id: '1', staff_id: '2' });
  });

  it('normalizes list', () => {
    expect(normalizeStaffAvailabilityList(null)).toEqual([]);
    expect(normalizeStaffAvailabilityList([{ id: '1' }, null, { id: '2' }])).toEqual([
      { id: '1' },
      { id: '2' },
    ]);
  });
});

