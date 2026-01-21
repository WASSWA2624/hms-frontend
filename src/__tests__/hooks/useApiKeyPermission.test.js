/**
 * useApiKeyPermission Hook Tests
 * File: useApiKeyPermission.test.js
 */
import useApiKeyPermission from '@hooks/useApiKeyPermission';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useApiKeyPermission', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useApiKeyPermission);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
