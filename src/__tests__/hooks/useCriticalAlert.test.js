/**
 * useCriticalAlert Hook Tests
 * File: useCriticalAlert.test.js
 */
import useCriticalAlert from '@hooks/useCriticalAlert';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useCriticalAlert', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useCriticalAlert);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
