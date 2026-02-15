/**
 * useWardRound Hook Tests
 * File: useWardRound.test.js
 */
import useWardRound from '@hooks/useWardRound';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useWardRound', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useWardRound);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
