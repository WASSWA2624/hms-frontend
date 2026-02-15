/**
 * useLabSample Hook Tests
 * File: useLabSample.test.js
 */
import useLabSample from '@hooks/useLabSample';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useLabSample', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useLabSample);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
