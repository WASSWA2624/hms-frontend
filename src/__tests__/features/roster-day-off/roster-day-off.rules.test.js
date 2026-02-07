/**
 * Roster Day Off Rules Tests
 * File: roster-day-off.rules.test.js
 */
import {
  parseRosterDayOffId,
  parseRosterDayOffListParams,
  parseRosterDayOffPayload,
} from '@features/roster-day-off';

describe('roster-day-off.rules', () => {
  it('parses ids', () => {
    expect(parseRosterDayOffId('1')).toBe('1');
    expect(parseRosterDayOffId(1)).toBe(1);
  });

  it('rejects invalid ids', () => {
    expect(() => parseRosterDayOffId(null)).toThrow();
    expect(() => parseRosterDayOffId('')).toThrow();
  });

  it('parses payloads', () => {
    expect(parseRosterDayOffPayload(null)).toEqual({});
    expect(parseRosterDayOffPayload({ day: 'monday' })).toEqual({ day: 'monday' });
  });

  it('parses list params', () => {
    expect(parseRosterDayOffListParams(null)).toEqual({});
    expect(parseRosterDayOffListParams({ page: 1, limit: 20, order: 'desc' })).toEqual({
      page: 1,
      limit: 20,
      order: 'desc',
    });
    expect(() => parseRosterDayOffListParams({ limit: 0 })).toThrow();
  });
});

