/**
 * usePayrollRun Hook Tests
 * File: usePayrollRun.test.js
 */
import usePayrollRun from '@hooks/usePayrollRun';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('usePayrollRun', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(usePayrollRun);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
