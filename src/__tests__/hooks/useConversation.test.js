/**
 * useConversation Hook Tests
 * File: useConversation.test.js
 */
import useConversation from '@hooks/useConversation';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useConversation', () => {
  it('exposes conversation handlers', () => {
    const result = renderHookResult(useConversation);
    expectCrudHook(result, [
      'list',
      'get',
      'create',
      'update',
      'remove',
    ]);
  });
});
