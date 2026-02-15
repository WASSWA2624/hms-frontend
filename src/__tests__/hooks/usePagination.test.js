/**
 * usePagination Hook Tests
 * File: usePagination.test.js
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import usePagination, { toPositiveInt } from '@hooks/usePagination';

const TestComponent = ({ initialPage, initialLimit, onResult }) => {
  const api = usePagination({ initialPage, initialLimit });
  React.useEffect(() => {
    onResult(api);
  });
  return null;
};

const TestDefaultComponent = ({ onResult }) => {
  const api = usePagination();
  React.useEffect(() => {
    onResult(api);
  });
  return null;
};

describe('usePagination', () => {
  it('sanitizes values with toPositiveInt utility', () => {
    expect(toPositiveInt('9.9', 1)).toBe(9);
    expect(toPositiveInt('not-a-number', 2)).toBe(2);
    expect(toPositiveInt(Infinity, 3)).toBe(3);
    expect(toPositiveInt(0, 4)).toBe(4);
  });

  it('uses default initial values when no arguments are provided', async () => {
    let api;
    render(<TestDefaultComponent onResult={(value) => (api = value)} />);

    await waitFor(() => {
      expect(api.page).toBe(1);
      expect(api.limit).toBe(20);
    });
  });

  it('respects initial values', async () => {
    let api;
    render(
      <TestComponent
        initialPage={2}
        initialLimit={25}
        onResult={(value) => (api = value)}
      />
    );

    await waitFor(() => {
      expect(api.page).toBe(2);
      expect(api.limit).toBe(25);
    });
  });

  it('setters update page/limit deterministically (positive ints only)', async () => {
    let api;
    render(<TestComponent initialPage={1} initialLimit={10} onResult={(v) => (api = v)} />);

    await waitFor(() => expect(api.page).toBe(1));

    act(() => {
      api.setPage(3.7);
      api.setLimit('50');
    });

    await waitFor(() => {
      expect(api.page).toBe(3);
      expect(api.limit).toBe(50);
    });

    act(() => {
      api.setPage(0);
      api.setLimit(-10);
    });

    await waitFor(() => {
      expect(api.page).toBe(3);
      expect(api.limit).toBe(50);
    });
  });

  it('nextPage/prevPage apply bounds (page >= 1)', async () => {
    let api;
    render(<TestComponent initialPage={1} initialLimit={10} onResult={(v) => (api = v)} />);

    await waitFor(() => expect(api.page).toBe(1));

    act(() => {
      api.prevPage();
    });

    await waitFor(() => expect(api.page).toBe(1));

    act(() => {
      api.nextPage();
      api.nextPage();
    });

    await waitFor(() => expect(api.page).toBe(3));
  });

  it('reset returns to initial state', async () => {
    let api;
    render(<TestComponent initialPage={2} initialLimit={10} onResult={(v) => (api = v)} />);

    await waitFor(() => expect(api.page).toBe(2));

    act(() => {
      api.setPage(5);
      api.setLimit(99);
    });

    await waitFor(() => {
      expect(api.page).toBe(5);
      expect(api.limit).toBe(99);
    });

    act(() => {
      api.reset();
    });

    await waitFor(() => {
      expect(api.page).toBe(2);
      expect(api.limit).toBe(10);
    });
  });

  it('sanitizes invalid initial values and supports functional updates', async () => {
    let api;
    render(<TestComponent initialPage={0} initialLimit={'abc'} onResult={(v) => (api = v)} />);

    await waitFor(() => {
      expect(api.page).toBe(1);
      expect(api.limit).toBe(20);
    });

    act(() => {
      api.setPage((prev) => prev + 1);
      api.setLimit((prev) => prev + 5);
    });

    await waitFor(() => {
      expect(api.page).toBe(2);
      expect(api.limit).toBe(25);
    });
  });
});

