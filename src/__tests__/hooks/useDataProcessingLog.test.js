/**
 * useDataProcessingLog Hook Tests
 * File: useDataProcessingLog.test.js
 */
import useDataProcessingLog from '@hooks/useDataProcessingLog';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useDataProcessingLog', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useDataProcessingLog);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
