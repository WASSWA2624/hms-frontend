/**
 * useAuditLog Hook Tests
 * File: useAuditLog.test.js
 */
import useAuditLog from '@hooks/useAuditLog';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useAuditLog', () => {
  it('exposes list/get handlers', () => {
    const result = renderHookResult(useAuditLog);
    expectCrudHook(result, ['list', 'get']);
  });
});
