/**
 * useDepartment Hook Tests
 * File: useDepartment.test.js
 */
import useDepartment from '@hooks/useDepartment';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useDepartment', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useDepartment);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
