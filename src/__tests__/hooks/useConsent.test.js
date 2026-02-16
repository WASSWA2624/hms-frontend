/**
 * useConsent Hook Tests
 * File: useConsent.test.js
 */
import useConsent from '@hooks/useConsent';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useConsent', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useConsent);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
