/**
 * usePacsLink Hook Tests
 * File: usePacsLink.test.js
 */
import usePacsLink from '@hooks/usePacsLink';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('usePacsLink', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(usePacsLink);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
