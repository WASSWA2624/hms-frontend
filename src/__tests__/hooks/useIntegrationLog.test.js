/**
 * useIntegrationLog Hook Tests
 * File: useIntegrationLog.test.js
 */
import useIntegrationLog from '@hooks/useIntegrationLog';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useIntegrationLog', () => {
  it('exposes list/get handlers', () => {
    const result = renderHookResult(useIntegrationLog);
    expectCrudHook(result, ['list', 'get']);
  });
});
