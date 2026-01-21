/**
 * useFacility Hook Tests
 * File: useFacility.test.js
 */
import useFacility from '@hooks/useFacility';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useFacility', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useFacility);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
