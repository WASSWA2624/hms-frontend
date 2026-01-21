/**
 * useOauthAccount Hook Tests
 * File: useOauthAccount.test.js
 */
import useOauthAccount from '@hooks/useOauthAccount';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useOauthAccount', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useOauthAccount);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
