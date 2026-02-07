/**
 * Shift Template Model Tests
 * File: shift-template.model.test.js
 */
import { normalizeShiftTemplate, normalizeShiftTemplateList } from '@features/shift-template';

describe('shift-template.model', () => {
  it('normalizes single item', () => {
    expect(normalizeShiftTemplate(null)).toBeNull();
    expect(normalizeShiftTemplate({ id: '1', name: 'A' })).toEqual({ id: '1', name: 'A' });
  });

  it('normalizes list', () => {
    expect(normalizeShiftTemplateList(null)).toEqual([]);
    expect(normalizeShiftTemplateList([{ id: '1' }, null, { id: '2' }])).toEqual([
      { id: '1' },
      { id: '2' },
    ]);
  });
});

