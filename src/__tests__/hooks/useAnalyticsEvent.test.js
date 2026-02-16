/**
 * useAnalyticsEvent Hook Tests
 * File: useAnalyticsEvent.test.js
 */
import useAnalyticsEvent from '@hooks/useAnalyticsEvent';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useAnalyticsEvent', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useAnalyticsEvent);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
