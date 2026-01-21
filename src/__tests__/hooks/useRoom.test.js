/**
 * useRoom Hook Tests
 * File: useRoom.test.js
 */
import useRoom from '@hooks/useRoom';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useRoom', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useRoom);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
