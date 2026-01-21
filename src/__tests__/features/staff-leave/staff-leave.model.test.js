/**
 * Staff Leave Model Tests
 * File: staff-leave.model.test.js
 */
import { normalizeStaffLeave, normalizeStaffLeaveList } from '@features/staff-leave';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('staff-leave.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeStaffLeave, normalizeStaffLeaveList);
  });
});
