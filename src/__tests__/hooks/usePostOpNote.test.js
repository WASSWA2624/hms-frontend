/**
 * usePostOpNote Hook Tests
 * File: usePostOpNote.test.js
 */
import usePostOpNote from '@hooks/usePostOpNote';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('usePostOpNote', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(usePostOpNote);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
