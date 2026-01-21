/**
 * User Profile Model Tests
 * File: user-profile.model.test.js
 */
import { normalizeUserProfile, normalizeUserProfileList } from '@features/user-profile';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('user-profile.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeUserProfile, normalizeUserProfileList);
  });
});
