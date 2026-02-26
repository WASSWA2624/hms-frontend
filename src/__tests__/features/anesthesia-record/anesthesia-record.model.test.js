/**
 * Anesthesia Record Model Tests
 * File: anesthesia-record.model.test.js
 */
import {
  normalizeAnesthesiaRecord,
  normalizeAnesthesiaRecordList,
} from '@features/anesthesia-record';

describe('anesthesia-record.model', () => {
  it('normalizes null and primitive inputs safely', () => {
    expect(normalizeAnesthesiaRecord(null)).toBeNull();
    expect(normalizeAnesthesiaRecord(undefined)).toBeNull();
    expect(normalizeAnesthesiaRecord('invalid')).toBeNull();
  });

  it('maps display identifiers for record, theatre case, and anesthetist', () => {
    const result = normalizeAnesthesiaRecord({
      id: 'b1b8dc1a-c170-4f3c-a0ca-68bc2b6ca009',
      display_id: 'ANR-2001',
      theatre_case_id: 'raw-case-1',
      theatre_case_display_id: 'THC-2001',
      anesthetist_user_id: 'raw-user-1',
      anesthetist_user_display_id: 'STF-10',
    });

    expect(result.id).toBe('ANR-2001');
    expect(result.display_id).toBe('ANR-2001');
    expect(result.human_friendly_id).toBe('ANR-2001');
    expect(result.theatre_case_display_id).toBe('THC-2001');
    expect(result.theatre_case_id).toBe('THC-2001');
    expect(result.anesthetist_user_display_id).toBe('STF-10');
    expect(result.anesthetist_user_id).toBe('STF-10');
  });

  it('normalizes list payloads with array and paged objects', () => {
    const arrayResult = normalizeAnesthesiaRecordList([
      { display_id: 'ANR-1' },
      null,
      { display_id: 'ANR-2' },
    ]);
    expect(arrayResult).toEqual([
      expect.objectContaining({ id: 'ANR-1' }),
      expect.objectContaining({ id: 'ANR-2' }),
    ]);

    const pagedResult = normalizeAnesthesiaRecordList({
      items: [{ display_id: 'ANR-7' }],
      pagination: { total: 1 },
    });
    expect(pagedResult).toMatchObject({
      items: [expect.objectContaining({ id: 'ANR-7' })],
      pagination: { total: 1 },
    });
  });
});
