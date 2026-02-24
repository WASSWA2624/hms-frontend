/**
 * useCrud Hook Tests
 * File: useCrud.test.js
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import useCrud from '@hooks/useCrud';

const TestComponent = ({ actions, onResult }) => {
  const api = useCrud(actions);
  React.useEffect(() => {
    onResult(api);
  });
  return null;
};

describe('useCrud', () => {
  it('runs actions and updates async state', async () => {
    const action = jest.fn().mockResolvedValue({ ok: true });
    let api;
    render(<TestComponent actions={{ list: action }} onResult={(value) => (api = value)} />);

    await waitFor(() => {
      expect(api.isLoading).toBe(false);
      expect(api.errorCode).toBeNull();
    });

    await act(async () => {
      await api.list();
    });

    await waitFor(() => {
      expect(api.isLoading).toBe(false);
      expect(api.data).toEqual({ ok: true });
    });
  });

  it('stores error codes when action fails', async () => {
    const action = jest.fn().mockRejectedValue({ code: 'UNAUTHORIZED' });
    let api;
    render(<TestComponent actions={{ get: action }} onResult={(value) => (api = value)} />);

    await act(async () => {
      try {
        await api.get('1');
      } catch (error) {
        expect(error.code).toBe('UNAUTHORIZED');
      }
    });

    await waitFor(() => {
      expect(api.errorCode).toBe('UNAUTHORIZED');
    });
  });

  it('keeps action handlers stable when action keys are unchanged', async () => {
    const action = jest.fn().mockResolvedValue({ ok: true });
    let api;

    const { rerender } = render(
      <TestComponent actions={{ list: action }} onResult={(value) => (api = value)} />
    );

    await waitFor(() => {
      expect(typeof api.list).toBe('function');
    });

    const firstApiRef = api;
    const firstListRef = api.list;

    rerender(<TestComponent actions={{ list: action }} onResult={(value) => (api = value)} />);

    await waitFor(() => {
      expect(api).toBe(firstApiRef);
      expect(api.list).toBe(firstListRef);
    });
  });

  it('uses the latest action implementation behind stable handlers', async () => {
    const firstAction = jest.fn().mockResolvedValue({ phase: 'first' });
    const secondAction = jest.fn().mockResolvedValue({ phase: 'second' });
    let api;

    const { rerender } = render(
      <TestComponent actions={{ list: firstAction }} onResult={(value) => (api = value)} />
    );

    await waitFor(() => {
      expect(typeof api.list).toBe('function');
    });

    const stableListRef = api.list;
    rerender(
      <TestComponent actions={{ list: secondAction }} onResult={(value) => (api = value)} />
    );

    await waitFor(() => {
      expect(api.list).toBe(stableListRef);
    });

    await act(async () => {
      await api.list();
    });

    expect(secondAction).toHaveBeenCalledTimes(1);
    expect(firstAction).toHaveBeenCalledTimes(0);
  });
});
