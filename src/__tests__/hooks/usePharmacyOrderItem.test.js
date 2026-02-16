/**
 * usePharmacyOrderItem Hook Tests
 * File: usePharmacyOrderItem.test.js
 */
import usePharmacyOrderItem from '@hooks/usePharmacyOrderItem';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('usePharmacyOrderItem', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(usePharmacyOrderItem);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
