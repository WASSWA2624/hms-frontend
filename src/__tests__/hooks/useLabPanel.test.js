/**
 * useLabPanel Hook Tests
 * File: useLabPanel.test.js
 */
import useLabPanel from '@hooks/useLabPanel';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useLabPanel', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useLabPanel);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
