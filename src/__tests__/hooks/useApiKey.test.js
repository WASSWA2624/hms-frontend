/**
 * useApiKey Hook Tests
 * File: useApiKey.test.js
 */
import useApiKey from '@hooks/useApiKey';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useApiKey', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useApiKey);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
