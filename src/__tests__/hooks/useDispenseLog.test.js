/**
 * useDispenseLog Hook Tests
 * File: useDispenseLog.test.js
 */
import useDispenseLog from '@hooks/useDispenseLog';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useDispenseLog', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useDispenseLog);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
