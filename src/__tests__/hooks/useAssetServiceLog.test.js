/**
 * useAssetServiceLog Hook Tests
 * File: useAssetServiceLog.test.js
 */
import useAssetServiceLog from '@hooks/useAssetServiceLog';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useAssetServiceLog', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useAssetServiceLog);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
