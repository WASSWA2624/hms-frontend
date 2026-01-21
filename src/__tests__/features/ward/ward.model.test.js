/**
 * Ward Model Tests
 * File: ward.model.test.js
 */
import { normalizeWard, normalizeWardList } from '@features/ward';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('ward.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeWard, normalizeWardList);
  });
});
