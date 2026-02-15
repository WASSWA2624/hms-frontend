/**
 * Hooks Barrel Export Tests
 * File: index.test.js
 */
import {
  useAsyncState,
  useDebounce,
  useI18n,
  useNetwork,
  usePagination,
  useTheme,
} from '@hooks';

describe('@hooks barrel', () => {
  it('exports Phase 005 reusable hooks as named exports', () => {
    expect(typeof useTheme).toBe('function');
    expect(typeof useNetwork).toBe('function');
    expect(typeof useI18n).toBe('function');
    expect(typeof useDebounce).toBe('function');
    expect(typeof usePagination).toBe('function');
    expect(typeof useAsyncState).toBe('function');
  });
});


