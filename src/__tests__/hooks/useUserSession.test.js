/**
 * useUserSession Hook Tests
 * File: useUserSession.test.js
 */
import useUserSession from '@hooks/useUserSession';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useUserSession', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useUserSession);
    expectCrudHook(result, ['list', 'get', 'revoke']);
  });
});
