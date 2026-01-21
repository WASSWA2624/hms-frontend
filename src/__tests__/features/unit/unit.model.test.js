/**
 * Unit Model Tests
 * File: unit.model.test.js
 */
import { normalizeUnit, normalizeUnitList } from '@features/unit';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('unit.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeUnit, normalizeUnitList);
  });
});
