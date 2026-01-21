/**
 * User Model Tests
 * File: user.model.test.js
 */
import { normalizeUser, normalizeUserList } from '@features/user';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('user.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeUser, normalizeUserList);
  });
});
