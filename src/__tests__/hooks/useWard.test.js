/**
 * useWard Hook Tests
 * File: useWard.test.js
 */
import useWard from '@hooks/useWard';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useWard', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useWard);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
