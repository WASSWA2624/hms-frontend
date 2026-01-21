/**
 * Facility Model Tests
 * File: facility.model.test.js
 */
import { normalizeFacility, normalizeFacilityList } from '@features/facility';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('facility.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeFacility, normalizeFacilityList);
  });
});
