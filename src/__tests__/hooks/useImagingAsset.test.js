/**
 * useImagingAsset Hook Tests
 * File: useImagingAsset.test.js
 */
import useImagingAsset from '@hooks/useImagingAsset';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useImagingAsset', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useImagingAsset);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
