/**
 * OAuth Account Model Tests
 * File: oauth-account.model.test.js
 */
import { normalizeOauthAccount, normalizeOauthAccountList } from '@features/oauth-account';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('oauth-account.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeOauthAccount, normalizeOauthAccountList);
  });
});
