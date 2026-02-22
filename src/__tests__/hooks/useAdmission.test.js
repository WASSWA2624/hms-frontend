/**
 * useAdmission Hook Tests
 * File: useAdmission.test.js
 */
import useAdmission from '@hooks/useAdmission';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useAdmission', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useAdmission);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove', 'discharge', 'transfer']);
  });
});
