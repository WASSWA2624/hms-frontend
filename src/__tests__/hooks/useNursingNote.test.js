/**
 * useNursingNote Hook Tests
 * File: useNursingNote.test.js
 */
import useNursingNote from '@hooks/useNursingNote';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useNursingNote', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useNursingNote);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
