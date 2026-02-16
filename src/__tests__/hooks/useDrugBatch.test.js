/**
 * useDrugBatch Hook Tests
 * File: useDrugBatch.test.js
 */
import useDrugBatch from '@hooks/useDrugBatch';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useDrugBatch', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useDrugBatch);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
