/**
 * useAnesthesiaRecord Hook Tests
 * File: useAnesthesiaRecord.test.js
 */
import useAnesthesiaRecord from '@hooks/useAnesthesiaRecord';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useAnesthesiaRecord', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useAnesthesiaRecord);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
