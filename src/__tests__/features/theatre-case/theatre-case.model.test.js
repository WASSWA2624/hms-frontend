/**
 * Theatre Case Model Tests
 * File: theatre-case.model.test.js
 */
import {
  normalizeTheatreCase,
  normalizeTheatreCaseList,
} from '@features/theatre-case';

describe('theatre-case.model', () => {
  it('normalizes null and primitive inputs safely', () => {
    expect(normalizeTheatreCase(null)).toBeNull();
    expect(normalizeTheatreCase(undefined)).toBeNull();
    expect(normalizeTheatreCase('invalid')).toBeNull();
  });

  it('maps display identifiers to id and related display fields', () => {
    const result = normalizeTheatreCase({
      id: '8c6bc8f2-a0d3-4a66-b098-c592f73f6f40',
      display_id: 'THC-1001',
      encounter_id: 'enc-raw-1',
      encounter_display_id: 'ENC-1001',
      patient_display_id: 'PAT-77',
      room_id: 'room-raw-1',
      room_display_id: 'RM-10',
    });

    expect(result.id).toBe('THC-1001');
    expect(result.display_id).toBe('THC-1001');
    expect(result.human_friendly_id).toBe('THC-1001');
    expect(result.theatre_case_display_id).toBe('THC-1001');
    expect(result.encounter_display_id).toBe('ENC-1001');
    expect(result.patient_display_id).toBe('PAT-77');
    expect(result.room_display_id).toBe('RM-10');
  });

  it('normalizes both array and paginated list responses', () => {
    const arrayResult = normalizeTheatreCaseList([
      { display_id: 'THC-1' },
      null,
      { display_id: 'THC-2' },
    ]);
    expect(arrayResult).toEqual([
      expect.objectContaining({ id: 'THC-1' }),
      expect.objectContaining({ id: 'THC-2' }),
    ]);

    const pagedResult = normalizeTheatreCaseList({
      items: [{ display_id: 'THC-7' }],
      pagination: { total: 1 },
    });
    expect(pagedResult).toMatchObject({
      items: [expect.objectContaining({ id: 'THC-7' })],
      pagination: { total: 1 },
    });
  });
});
