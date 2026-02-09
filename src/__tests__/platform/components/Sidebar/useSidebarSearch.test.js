/**
 * useSidebarSearch Hook Tests
 * File: useSidebarSearch.test.js
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import useSidebarSearch from '@platform/components/navigation/Sidebar/useSidebarSearch';

const TestHarness = ({ items, query, onResult, maxResults, t }) => {
  const result = useSidebarSearch({
    items,
    query,
    t: t || ((key) => key),
    itemsI18nPrefix: 'navigation.items.main',
    ...(typeof maxResults === 'number' ? { maxResults } : {}),
  });

  React.useEffect(() => {
    onResult(result);
  }, [result, onResult]);

  return null;
};

describe('useSidebarSearch', () => {
  it('returns empty results when query is empty', async () => {
    const onResult = jest.fn();
    render(<TestHarness items={[]} query="" onResult={onResult} />);

    await waitFor(() => expect(onResult).toHaveBeenCalled());
    const { hasQuery, results, totalResults } = onResult.mock.calls.pop()[0];
    expect(hasQuery).toBe(false);
    expect(results).toEqual([]);
    expect(totalResults).toBe(0);
  });

  it('matches labels and parent labels case-insensitively', async () => {
    const items = [
      {
        id: 'settings',
        label: 'Settings',
        href: '/settings',
        children: [
          { id: 'settings-users', label: 'User Roles', path: '/settings/roles' },
        ],
      },
    ];
    const onResult = jest.fn();
    render(<TestHarness items={items} query="roles" onResult={onResult} />);

    await waitFor(() => expect(onResult).toHaveBeenCalled());
    const { results } = onResult.mock.calls.pop()[0];
    expect(results.length).toBe(1);
    expect(results[0].label).toBe('User Roles');
    expect(results[0].parentLabel).toBe('Settings');
  });

  it('uses i18n fallback labels and skips items without href or label', async () => {
    const t = (key) => (key === 'navigation.items.main.dashboard' ? 'Dashboard' : '');
    const items = [
      { id: 'dashboard', name: 'navigation.items.main.dashboard', path: '/dashboard' },
      { id: 'no-href', label: 'No Href' },
      { path: '/missing-label' },
    ];
    const onResult = jest.fn();
    render(<TestHarness items={items} query="dash" onResult={onResult} t={t} />);

    await waitFor(() => expect(onResult).toHaveBeenCalled());
    const { results } = onResult.mock.calls.pop()[0];
    expect(results.length).toBe(1);
    expect(results[0].label).toBe('Dashboard');
    expect(results[0].href).toBe('/dashboard');
  });

  it('matches parent labels when child labels do not include the token', async () => {
    const t = (key) => (key === 'navigation.items.main.settings' ? 'Core Settings' : key);
    const items = [
      {
        id: 'settings',
        name: 'navigation.items.main.settings',
        path: '/settings',
        children: [{ id: 'users', label: 'Users', path: '/settings/users' }],
      },
    ];
    const onResult = jest.fn();
    const { rerender } = render(<TestHarness items={items} query="settings" onResult={onResult} t={t} />);

    await waitFor(() => expect(onResult).toHaveBeenCalled());
    const { results } = onResult.mock.calls.pop()[0];
    expect(results.length).toBe(1);
    expect(results[0].label).toBe('Users');
    expect(results[0].parentLabel).toBe('Core Settings');

    rerender(<TestHarness items={items} query="core" onResult={onResult} t={t} />);
    await waitFor(() => expect(onResult).toHaveBeenCalled());
    const nextResults = onResult.mock.calls.pop()[0].results;
    expect(nextResults.length).toBe(1);
    expect(nextResults[0].label).toBe('Users');
  });

  it('requires all tokens and matches by id or href', async () => {
    const items = [
      { id: 'api-keys', label: 'API Keys', href: '/settings/api-keys' },
      { id: 'billing', label: 'Keys', href: '/settings/billing-keys' },
      { id: 'users', label: 'Users', href: '/settings/users' },
    ];
    const onResult = jest.fn();
    const { rerender } = render(<TestHarness items={items} query="api keys" onResult={onResult} />);

    await waitFor(() => expect(onResult).toHaveBeenCalled());
    let results = onResult.mock.calls.pop()[0].results;
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('api-keys');

    rerender(<TestHarness items={items} query="api missing" onResult={onResult} />);
    await waitFor(() => expect(onResult).toHaveBeenCalled());
    results = onResult.mock.calls.pop()[0].results;
    expect(results.length).toBe(0);

    rerender(<TestHarness items={items} query="api-keys" onResult={onResult} />);
    await waitFor(() => expect(onResult).toHaveBeenCalled());
    results = onResult.mock.calls.pop()[0].results;
    expect(results.length).toBe(1);
    expect(results[0].href).toBe('/settings/api-keys');

    rerender(<TestHarness items={items} query="settings" onResult={onResult} />);
    await waitFor(() => expect(onResult).toHaveBeenCalled());
    results = onResult.mock.calls.pop()[0].results;
    expect(results.some((entry) => entry.id === 'billing')).toBe(true);
  });

  it('respects maxResults', async () => {
    const items = [
      { id: 'one', label: 'One', href: '/one' },
      { id: 'two', label: 'Two', href: '/two' },
      { id: 'three', label: 'Three', href: '/three' },
    ];
    const onResult = jest.fn();
    render(<TestHarness items={items} query="o" maxResults={1} onResult={onResult} />);

    await waitFor(() => expect(onResult).toHaveBeenCalled());
    const { results } = onResult.mock.calls.pop()[0];
    expect(results.length).toBe(1);
  });
});
