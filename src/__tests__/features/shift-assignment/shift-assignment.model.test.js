/**
 * Shift Assignment Model Tests
 * File: shift-assignment.model.test.js
 */
import { normalizeShiftAssignment, normalizeShiftAssignmentList } from '@features/shift-assignment';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('shift-assignment.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeShiftAssignment, normalizeShiftAssignmentList);
  });
});
