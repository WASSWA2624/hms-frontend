/**
 * useMessage Hook Tests
 * File: useMessage.test.js
 */
import useMessage from '@hooks/useMessage';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useMessage', () => {
  it('exposes message handlers', () => {
    const result = renderHookResult(useMessage);
    expectCrudHook(result, [
      'list',
      'get',
      'create',
      'update',
      'remove',
    ]);
  });
});
