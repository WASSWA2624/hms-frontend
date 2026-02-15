/**
 * useTransferRequest Hook Tests
 * File: useTransferRequest.test.js
 */
import useTransferRequest from '@hooks/useTransferRequest';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useTransferRequest', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useTransferRequest);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
