/**
 * useDrug Hook Tests
 * File: useDrug.test.js
 */
import useDrug from '@hooks/useDrug';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useDrug', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useDrug);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
