/**
 * Staff Profile Model Tests
 * File: staff-profile.model.test.js
 */
import { normalizeStaffProfile, normalizeStaffProfileList } from '@features/staff-profile';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('staff-profile.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeStaffProfile, normalizeStaffProfileList);
  });
});
