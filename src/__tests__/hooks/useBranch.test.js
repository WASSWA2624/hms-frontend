/**
 * useBranch Hook Tests
 * File: useBranch.test.js
 */
import useBranch from '@hooks/useBranch';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useBranch', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useBranch);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
