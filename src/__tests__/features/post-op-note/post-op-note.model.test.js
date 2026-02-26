/**
 * Post-Op Note Model Tests
 * File: post-op-note.model.test.js
 */
import {
  normalizePostOpNote,
  normalizePostOpNoteList,
} from '@features/post-op-note';

describe('post-op-note.model', () => {
  it('normalizes null and primitive inputs safely', () => {
    expect(normalizePostOpNote(null)).toBeNull();
    expect(normalizePostOpNote(undefined)).toBeNull();
    expect(normalizePostOpNote('invalid')).toBeNull();
  });

  it('maps display identifiers for record and theatre case', () => {
    const result = normalizePostOpNote({
      id: 'deaf416f-3b14-468b-b266-5360df6f37bf',
      display_id: 'PON-3001',
      theatre_case_id: 'raw-case-1',
      theatre_case_display_id: 'THC-3001',
      note: 'Stable in recovery',
    });

    expect(result.id).toBe('PON-3001');
    expect(result.display_id).toBe('PON-3001');
    expect(result.human_friendly_id).toBe('PON-3001');
    expect(result.theatre_case_display_id).toBe('THC-3001');
    expect(result.theatre_case_id).toBe('THC-3001');
    expect(result.note).toBe('Stable in recovery');
  });

  it('normalizes list payloads with array and paged objects', () => {
    const arrayResult = normalizePostOpNoteList([
      { display_id: 'PON-1' },
      null,
      { display_id: 'PON-2' },
    ]);
    expect(arrayResult).toEqual([
      expect.objectContaining({ id: 'PON-1' }),
      expect.objectContaining({ id: 'PON-2' }),
    ]);

    const pagedResult = normalizePostOpNoteList({
      items: [{ display_id: 'PON-7' }],
      pagination: { total: 1 },
    });
    expect(pagedResult).toMatchObject({
      items: [expect.objectContaining({ id: 'PON-7' })],
      pagination: { total: 1 },
    });
  });
});
