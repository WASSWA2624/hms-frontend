/**
 * useUnit Hook Tests
 * File: useUnit.test.js
 */
import useUnit from '@hooks/useUnit';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useUnit', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useUnit);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
