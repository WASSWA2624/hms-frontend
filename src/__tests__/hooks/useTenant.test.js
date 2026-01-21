/**
 * useTenant Hook Tests
 * File: useTenant.test.js
 */
import useTenant from '@hooks/useTenant';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useTenant', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useTenant);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
