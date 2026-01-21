/**
 * Shift Model Tests
 * File: shift.model.test.js
 */
import { normalizeShift, normalizeShiftList } from '@features/shift';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('shift.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeShift, normalizeShiftList);
  });
});
