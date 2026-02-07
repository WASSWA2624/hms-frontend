/**
 * Shift Template Rules Tests
 * File: shift-template.rules.test.js
 */
import {
  parseShiftTemplateId,
  parseShiftTemplateListParams,
  parseShiftTemplatePayload,
} from '@features/shift-template';

describe('shift-template.rules', () => {
  it('parses ids', () => {
    expect(parseShiftTemplateId('1')).toBe('1');
    expect(parseShiftTemplateId(1)).toBe(1);
  });

  it('rejects invalid ids', () => {
    expect(() => parseShiftTemplateId(null)).toThrow();
    expect(() => parseShiftTemplateId('')).toThrow();
  });

  it('parses payloads', () => {
    expect(parseShiftTemplatePayload(null)).toEqual({});
    expect(parseShiftTemplatePayload({ name: 'Shift A' })).toEqual({ name: 'Shift A' });
  });

  it('parses list params', () => {
    expect(parseShiftTemplateListParams(null)).toEqual({});
    expect(parseShiftTemplateListParams({ page: 1, limit: 20, order: 'asc' })).toEqual({
      page: 1,
      limit: 20,
      order: 'asc',
    });
    expect(() => parseShiftTemplateListParams({ page: -1 })).toThrow();
  });
});

