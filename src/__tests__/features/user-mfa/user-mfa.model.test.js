/**
 * User MFA Model Tests
 * File: user-mfa.model.test.js
 */
import { normalizeUserMfa, normalizeUserMfaList } from '@features/user-mfa';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('user-mfa.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeUserMfa, normalizeUserMfaList);
  });
});
