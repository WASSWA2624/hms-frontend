/**
 * useNotification Hook Tests
 * File: useNotification.test.js
 */
import useNotification from '@hooks/useNotification';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useNotification', () => {
  it('exposes notification handlers', () => {
    const result = renderHookResult(useNotification);
    expectCrudHook(result, [
      'list',
      'get',
      'create',
      'update',
      'remove',
      'markRead',
      'markUnread',
    ]);
  });
});
