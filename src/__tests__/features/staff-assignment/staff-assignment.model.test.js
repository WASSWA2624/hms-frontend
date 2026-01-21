/**
 * Staff Assignment Model Tests
 * File: staff-assignment.model.test.js
 */
import { normalizeStaffAssignment, normalizeStaffAssignmentList } from '@features/staff-assignment';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('staff-assignment.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeStaffAssignment, normalizeStaffAssignmentList);
  });
});
