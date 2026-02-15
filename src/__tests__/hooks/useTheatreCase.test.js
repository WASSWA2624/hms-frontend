/**
 * useTheatreCase Hook Tests
 * File: useTheatreCase.test.js
 */
import useTheatreCase from '@hooks/useTheatreCase';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useTheatreCase', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useTheatreCase);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
