/**
 * Sidebar Component Web Tests
 * File: Sidebar.web.test.js
 * @jest-environment jsdom
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import lightTheme from '@theme/light.theme';

const mockPush = jest.fn();
const mockPathname = '/settings';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
  }),
  usePathname: () => mockPathname,
}));

jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => {
      const map = {
        'navigation.sidebar.title': 'Main navigation',
        'navigation.sidebar.searchLabel': 'Search navigation',
        'navigation.sidebar.searchPlaceholder': 'Search menu',
        'navigation.sidebar.searchResultsLabel': 'Navigation search results',
        'navigation.sidebar.searchEmpty': 'No matches found',
        'common.searchPlaceholder': 'Search...',
        'common.searchIcon': 'Search icon',
        'common.clearSearch': 'Clear search',
      };
      return map[key] || key;
    },
    locale: 'en',
  }),
}));

const SidebarWeb = require('@platform/components/navigation/Sidebar/Sidebar.web').default;

const renderWithTheme = (component) => render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

describe('Sidebar Component - Web', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const items = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/home',
      icon: 'grid-outline',
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/settings',
      icon: 'settings-outline',
      children: [
        { id: 'settings-users', label: 'Users', path: '/settings/users', icon: 'people-outline' },
        { id: 'settings-roles', label: 'Roles', path: '/settings/roles', icon: 'people-outline' },
      ],
    },
  ];

  it('renders the search input when not collapsed', () => {
    const { getByLabelText } = renderWithTheme(<SidebarWeb items={items} testID="sidebar" />);
    const input = getByLabelText('Search navigation');
    expect(input).toBeTruthy();
  });

  it('hides the search input when collapsed', () => {
    const { queryByLabelText } = renderWithTheme(
      <SidebarWeb items={items} collapsed testID="sidebar" />
    );
    expect(queryByLabelText('Search navigation')).toBeNull();
  });

  it('filters results based on query and shows matches', () => {
    const { getByLabelText, getByText } = renderWithTheme(<SidebarWeb items={items} testID="sidebar" />);
    const input = getByLabelText('Search navigation');

    fireEvent.change(input, { target: { value: 'users' } });
    expect(getByText('Users')).toBeTruthy();
  });

  it('shows empty state when no results match', () => {
    const { getByLabelText, getByText } = renderWithTheme(<SidebarWeb items={items} testID="sidebar" />);
    const input = getByLabelText('Search navigation');

    fireEvent.change(input, { target: { value: 'not-found' } });
    expect(getByText('No matches found')).toBeTruthy();
  });

  it('routes to screen when a result is clicked', () => {
    const { getByLabelText, getByText } = renderWithTheme(<SidebarWeb items={items} testID="sidebar" />);
    const input = getByLabelText('Search navigation');

    fireEvent.change(input, { target: { value: 'roles' } });
    const label = getByText('Roles');
    const resultButton = label.closest('button');
    expect(resultButton).toBeTruthy();
    fireEvent.click(resultButton);
    expect(mockPush).toHaveBeenCalledWith('/settings/roles');
  });
});
