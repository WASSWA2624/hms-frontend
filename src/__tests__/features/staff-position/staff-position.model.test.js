/**
 * Staff Position Model Tests
 * File: staff-position.model.test.js
 */
import { normalizeStaffPosition, normalizeStaffPositionList } from '@features/staff-position';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('staff-position.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeStaffPosition, normalizeStaffPositionList);
  });
});

