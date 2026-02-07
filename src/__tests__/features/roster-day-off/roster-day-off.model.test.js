/**
 * Roster Day Off Model Tests
 * File: roster-day-off.model.test.js
 */
import { normalizeRosterDayOff, normalizeRosterDayOffList } from '@features/roster-day-off';

describe('roster-day-off.model', () => {
  it('normalizes single item', () => {
    expect(normalizeRosterDayOff(null)).toBeNull();
    expect(normalizeRosterDayOff({ id: '1', day: 'monday' })).toEqual({ id: '1', day: 'monday' });
  });

  it('normalizes list', () => {
    expect(normalizeRosterDayOffList(null)).toEqual([]);
    expect(normalizeRosterDayOffList([{ id: '1' }, null, { id: '2' }])).toEqual([
      { id: '1' },
      { id: '2' },
    ]);
  });
});

