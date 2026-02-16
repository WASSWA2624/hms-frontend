/**
 * useRefund Hook Tests
 * File: useRefund.test.js
 */
import useRefund from '@hooks/useRefund';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useRefund', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useRefund);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
