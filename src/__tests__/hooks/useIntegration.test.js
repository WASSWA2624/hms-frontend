/**
 * useIntegration Hook Tests
 * File: useIntegration.test.js
 */
import useIntegration from '@hooks/useIntegration';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useIntegration', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useIntegration);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove', 'testConnection', 'syncNow']);
  });
});
