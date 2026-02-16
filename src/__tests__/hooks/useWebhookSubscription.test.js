/**
 * useWebhookSubscription Hook Tests
 * File: useWebhookSubscription.test.js
 */
import useWebhookSubscription from '@hooks/useWebhookSubscription';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useWebhookSubscription', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useWebhookSubscription);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
