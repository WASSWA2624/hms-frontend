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
let mockPathname = '/settings';

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

jest.mock('@platform/components/forms/TextField', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ value, onChange, placeholder, accessibilityLabel, testID }) =>
      React.createElement('input', {
        value,
        onChange,
        placeholder,
        'aria-label': accessibilityLabel,
        'data-testid': testID,
      }),
  };
});

jest.mock('@platform/components/navigation/SidebarItem', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ item, onClick, onPress, testID }) =>
      React.createElement(
        'button',
        { type: 'button', onClick: onClick || onPress, 'data-testid': testID },
        item?.label || ''
      ),
  };
});

const SidebarWeb = require('@platform/components/navigation/Sidebar/Sidebar.web').default;

const renderWithTheme = (component) => render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

describe('Sidebar Component - Web', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = '/settings';
  });

  const items = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
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
    fireEvent.click(label);
    expect(mockPush).toHaveBeenCalledWith('/settings/roles');
  });

  it('filters hidden child items from search when isItemVisible excludes them', () => {
    const isItemVisible = (item) => item.id !== 'settings-roles';
    const { getByLabelText, queryByText } = renderWithTheme(
      <SidebarWeb items={items} isItemVisible={isItemVisible} testID="sidebar" />
    );
    const input = getByLabelText('Search navigation');

    fireEvent.change(input, { target: { value: 'roles' } });
    expect(queryByText('Roles')).toBeNull();
  });

  it('toggles and routes when a parent section is clicked', () => {
    mockPathname = '/dashboard';
    const { getByTestId, queryByTestId } = renderWithTheme(<SidebarWeb items={items} testID="sidebar" />);

    expect(queryByTestId('sidebar-item-settings-users')).toBeNull();
    fireEvent.click(getByTestId('sidebar-item-settings'));

    expect(mockPush).toHaveBeenCalledWith('/settings');
    expect(getByTestId('sidebar-item-settings-users')).toBeTruthy();
  });

  it('routes nested items to their own screens', () => {
    const { getByTestId } = renderWithTheme(<SidebarWeb items={items} testID="sidebar" />);

    fireEvent.click(getByTestId('sidebar-item-settings'));
    fireEvent.click(getByTestId('sidebar-item-settings-users'));

    expect(mockPush).toHaveBeenCalledWith('/settings/users');
  });

  it('allows collapsing the active parent section while a nested route is selected', () => {
    mockPathname = '/settings/users';
    const { getByTestId, queryByTestId } = renderWithTheme(<SidebarWeb items={items} testID="sidebar" />);

    expect(getByTestId('sidebar-item-settings-users')).toBeTruthy();
    fireEvent.click(getByTestId('sidebar-item-settings'));

    expect(mockPush).toHaveBeenCalledWith('/settings');
    expect(queryByTestId('sidebar-item-settings-users')).toBeNull();
  });
});
