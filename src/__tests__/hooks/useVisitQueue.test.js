/**
 * useVisitQueue Hook Tests
 * File: useVisitQueue.test.js
 */
import useVisitQueue from '@hooks/useVisitQueue';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useVisitQueue', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useVisitQueue);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove', 'prioritize']);
  });
});
