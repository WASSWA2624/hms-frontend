/**
 * useStaffPosition Hook Tests
 * File: useStaffPosition.test.js
 */
import useStaffPosition from '@hooks/useStaffPosition';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useStaffPosition', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useStaffPosition);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});

