/**
 * Bed Model Tests
 * File: bed.model.test.js
 */
import { normalizeBed, normalizeBedList } from '@features/bed';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('bed.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeBed, normalizeBedList);
  });
});
