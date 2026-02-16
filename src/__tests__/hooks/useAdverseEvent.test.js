/**
 * useAdverseEvent Hook Tests
 * File: useAdverseEvent.test.js
 */
import useAdverseEvent from '@hooks/useAdverseEvent';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useAdverseEvent', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useAdverseEvent);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
