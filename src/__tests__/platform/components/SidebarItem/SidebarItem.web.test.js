/**
 * SidebarItem Component Web Tests
 * File: SidebarItem.web.test.js
 * @jest-environment jsdom
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import lightTheme from '@theme/light.theme';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key, params = {}) => {
      const label = params.label ?? '';
      const map = {
        'navigation.sidebar.itemHint': `Open ${label}`,
        'navigation.sidebar.expandSectionLabel': `Expand ${label} section`,
        'navigation.sidebar.collapseSectionLabel': `Collapse ${label} section`,
        'navigation.sidebar.expandToggleHint': `Show or hide nested navigation items for ${label}`,
      };
      return map[key] || key;
    },
  }),
}));

jest.mock('@config/sideMenu', () => ({
  getMenuIconGlyph: () => '*',
}));

jest.mock('@platform/components/display/Icon', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ glyph }) => React.createElement('span', { 'data-testid': 'sidebar-item-icon' }, glyph),
  };
});

jest.mock('@platform/components/navigation/SidebarItem/SidebarItem.web.styles.jsx', () => {
  const React = require('react');

  const stripTransientProps = (props) =>
    Object.fromEntries(Object.entries(props).filter(([key]) => !key.startsWith('$')));

  const createElement = (tag) =>
    React.forwardRef(({ children, ...props }, ref) =>
      React.createElement(tag, { ref, ...stripTransientProps(props) }, children)
    );

  return {
    __esModule: true,
    Row: createElement('a'),
    IconWrapper: createElement('span'),
    Label: createElement('span'),
    ExpandButton: createElement('button'),
  };
});

const SidebarItemWeb = require('@platform/components/navigation/SidebarItem/SidebarItem.web').default;

const renderWithTheme = (component) => render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

describe('SidebarItem Component - Web', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('routes to the item path when the row is clicked', () => {
    const { getByTestId } = renderWithTheme(
      <SidebarItemWeb
        item={{ id: 'patients', label: 'Patients', path: '/patients', icon: 'people-outline' }}
        testID="sidebar-item-patients"
      />
    );

    fireEvent.click(getByTestId('sidebar-item-patients'));

    expect(mockPush).toHaveBeenCalledWith('/patients');
  });

  it('routes nested rows without toggling expansion', () => {
    const onToggleExpand = jest.fn();
    const { getByTestId } = renderWithTheme(
      <SidebarItemWeb
        item={{ id: 'patients-list', label: 'Patient List', path: '/patients/patients', icon: 'people-outline' }}
        level={1}
        hasChildren={false}
        onToggleExpand={onToggleExpand}
        testID="sidebar-item-patients-list"
      />
    );

    fireEvent.click(getByTestId('sidebar-item-patients-list'));

    expect(mockPush).toHaveBeenCalledWith('/patients/patients');
    expect(onToggleExpand).not.toHaveBeenCalled();
  });

  it('keeps expand button toggle-only and prevents route changes', () => {
    const onToggleExpand = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <SidebarItemWeb
        item={{ id: 'settings', label: 'Settings', path: '/settings', icon: 'settings-outline' }}
        hasChildren
        expanded={false}
        onToggleExpand={onToggleExpand}
        testID="sidebar-item-settings"
      />
    );

    fireEvent.click(getByLabelText('Expand Settings section'));

    expect(onToggleExpand).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled();
  });
});
