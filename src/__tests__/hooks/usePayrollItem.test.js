/**
 * usePayrollItem Hook Tests
 * File: usePayrollItem.test.js
 */
import usePayrollItem from '@hooks/usePayrollItem';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('usePayrollItem', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(usePayrollItem);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
