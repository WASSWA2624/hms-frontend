/**
 * useContact Hook Tests
 * File: useContact.test.js
 */
import useContact from '@hooks/useContact';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useContact', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useContact);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
