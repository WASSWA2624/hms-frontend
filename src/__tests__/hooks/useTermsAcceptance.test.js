/**
 * useTermsAcceptance Hook Tests
 * File: useTermsAcceptance.test.js
 */
import useTermsAcceptance from '@hooks/useTermsAcceptance';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useTermsAcceptance', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useTermsAcceptance);
    expectCrudHook(result, ['list', 'get', 'create', 'remove']);
  });
});
