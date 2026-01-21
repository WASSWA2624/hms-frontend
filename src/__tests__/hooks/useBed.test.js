/**
 * useBed Hook Tests
 * File: useBed.test.js
 */
import useBed from '@hooks/useBed';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useBed', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useBed);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
