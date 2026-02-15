/**
 * useIcuObservation Hook Tests
 * File: useIcuObservation.test.js
 */
import useIcuObservation from '@hooks/useIcuObservation';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useIcuObservation', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useIcuObservation);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
