/**
 * useBreachNotification Hook Tests
 * File: useBreachNotification.test.js
 */
import useBreachNotification from '@hooks/useBreachNotification';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useBreachNotification', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useBreachNotification);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
