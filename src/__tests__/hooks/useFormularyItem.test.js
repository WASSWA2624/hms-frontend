/**
 * useFormularyItem Hook Tests
 * File: useFormularyItem.test.js
 */
import useFormularyItem from '@hooks/useFormularyItem';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useFormularyItem', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useFormularyItem);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
