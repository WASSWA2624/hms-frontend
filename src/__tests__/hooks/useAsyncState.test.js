/**
 * useAsyncState Hook Tests
 * File: useAsyncState.test.js
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import useAsyncState, {
  asyncStateInitialState,
  asyncStateReducer,
  toErrorCode,
} from '@hooks/useAsyncState';

const TestComponent = ({ onResult }) => {
  const api = useAsyncState();
  React.useEffect(() => {
    onResult(api);
  });
  return null;
};

describe('useAsyncState', () => {
  it('normalizes error codes deterministically', () => {
    expect(toErrorCode('  NETWORK_ERROR ')).toBe('NETWORK_ERROR');
    expect(toErrorCode('')).toBe('UNKNOWN_ERROR');
    expect(toErrorCode(null)).toBe('UNKNOWN_ERROR');
    expect(toErrorCode({ message: 'oops' })).toBe('UNKNOWN_ERROR');
  });

  it('returns previous state for unknown reducer actions', () => {
    const previous = { ...asyncStateInitialState, isLoading: true, errorCode: 'X' };
    const next = asyncStateReducer(previous, { type: 'UNKNOWN' });
    expect(next).toBe(previous);
  });

  it('initial -> start -> succeed', async () => {
    let api;
    render(<TestComponent onResult={(v) => (api = v)} />);

    await waitFor(() => {
      expect(api.isLoading).toBe(false);
      expect(api.errorCode).toBeNull();
      expect(api.data).toBeNull();
    });

    act(() => {
      api.start();
    });
    await waitFor(() => expect(api.isLoading).toBe(true));

    act(() => {
      api.succeed({ ok: true });
    });
    await waitFor(() => {
      expect(api.isLoading).toBe(false);
      expect(api.errorCode).toBeNull();
      expect(api.data).toEqual({ ok: true });
    });
  });

  it('initial -> start -> fail (stores error codes only)', async () => {
    let api;
    render(<TestComponent onResult={(v) => (api = v)} />);

    act(() => {
      api.start();
      api.fail('NETWORK_ERROR');
    });

    await waitFor(() => {
      expect(api.isLoading).toBe(false);
      expect(api.errorCode).toBe('NETWORK_ERROR');
    });

    act(() => {
      api.fail({ message: 'nope' });
    });

    await waitFor(() => {
      expect(api.errorCode).toBe('UNKNOWN_ERROR');
    });
  });

  it('succeed() normalizes undefined data to null', async () => {
    let api;
    render(<TestComponent onResult={(v) => (api = v)} />);

    act(() => {
      api.start();
      api.succeed(undefined);
    });

    await waitFor(() => {
      expect(api.isLoading).toBe(false);
      expect(api.errorCode).toBeNull();
      expect(api.data).toBeNull();
    });
  });

  it('fail -> reset', async () => {
    let api;
    render(<TestComponent onResult={(v) => (api = v)} />);

    act(() => {
      api.start();
      api.fail('SERVER_ERROR');
    });

    await waitFor(() => expect(api.errorCode).toBe('SERVER_ERROR'));

    act(() => {
      api.reset();
    });

    await waitFor(() => {
      expect(api.isLoading).toBe(false);
      expect(api.errorCode).toBeNull();
      expect(api.data).toBeNull();
    });
  });

  it('start() is idempotent and deterministic', async () => {
    let api;
    render(<TestComponent onResult={(v) => (api = v)} />);

    act(() => {
      api.start();
      api.start();
    });

    await waitFor(() => {
      expect(api.isLoading).toBe(true);
      expect(api.errorCode).toBeNull();
    });
  });
});
