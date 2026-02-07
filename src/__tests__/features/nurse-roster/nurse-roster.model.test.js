/**
 * Nurse Roster Model Tests
 * File: nurse-roster.model.test.js
 */
import {
  normalizeNurseRoster,
  normalizeNurseRosterList,
} from '@features/nurse-roster';

describe('nurse-roster.model', () => {
  it('normalizes single roster', () => {
    const raw = { id: '1', tenant_id: 't1', status: 'DRAFT' };
    const result = normalizeNurseRoster(raw);
    expect(result).toEqual(raw);
  });

  it('returns null for null/undefined', () => {
    expect(normalizeNurseRoster(null)).toBeNull();
    expect(normalizeNurseRoster(undefined)).toBeNull();
  });

  it('normalizes roster list', () => {
    const raw = [
      { id: '1', tenant_id: 't1' },
      { id: '2', tenant_id: 't1' },
    ];
    const result = normalizeNurseRosterList(raw);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(raw[0]);
    expect(result[1]).toEqual(raw[1]);
  });

  it('returns empty array for non-array', () => {
    expect(normalizeNurseRosterList(null)).toEqual([]);
    expect(normalizeNurseRosterList(undefined)).toEqual([]);
  });
});
