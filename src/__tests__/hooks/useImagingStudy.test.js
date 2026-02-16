/**
 * useImagingStudy Hook Tests
 * File: useImagingStudy.test.js
 */
import useImagingStudy from '@hooks/useImagingStudy';
import { expectCrudHook } from '../helpers/hook-assertions';
import { renderHookResult } from '../helpers/render-hook';

describe('useImagingStudy', () => {
  it('exposes CRUD handlers', () => {
    const result = renderHookResult(useImagingStudy);
    expectCrudHook(result, ['list', 'get', 'create', 'update', 'remove']);
  });
});
