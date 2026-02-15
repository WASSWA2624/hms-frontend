/**
 * useLabQcLog Hook Tests
 * File: useLabQcLog.test.js
 */
import useLabQcLog from '@hooks/useLabQcLog';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useLabQcLog', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useLabQcLog);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
