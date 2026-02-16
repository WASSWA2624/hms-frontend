/**
 * useAsset Hook Tests
 * File: useAsset.test.js
 */
import useAsset from '@hooks/useAsset';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useAsset', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useAsset);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
