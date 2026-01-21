/**
 * Branch Model Tests
 * File: branch.model.test.js
 */
import { normalizeBranch, normalizeBranchList } from '@features/branch';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('branch.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeBranch, normalizeBranchList);
  });
});
