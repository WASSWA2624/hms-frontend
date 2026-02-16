/**
 * usePharmacyOrder Hook Tests
 * File: usePharmacyOrder.test.js
 */
import usePharmacyOrder from '@hooks/usePharmacyOrder';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('usePharmacyOrder', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(usePharmacyOrder);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
