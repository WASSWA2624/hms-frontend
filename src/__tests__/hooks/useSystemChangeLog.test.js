/**
 * useSystemChangeLog Hook Tests
 * File: useSystemChangeLog.test.js
 */
import useSystemChangeLog from '@hooks/useSystemChangeLog';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useSystemChangeLog', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useSystemChangeLog);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
