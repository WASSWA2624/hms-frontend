/**
 * usePreAuthorization Hook Tests
 * File: usePreAuthorization.test.js
 */
import usePreAuthorization from '@hooks/usePreAuthorization';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('usePreAuthorization', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(usePreAuthorization);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
