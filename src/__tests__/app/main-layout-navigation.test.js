/**
 * Main Layout Navigation Tests
 *
 * Step 7.17: navigation skeleton in main layout (header/tab bar/sidebar + Slot).
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import MainRouteLayoutWeb from '@platform/layouts/RouteLayouts/MainRouteLayout/MainRouteLayout.web';
import MainRouteLayoutAndroid from '@platform/layouts/RouteLayouts/MainRouteLayout/MainRouteLayout.android';
import MainRouteLayoutIOS from '@platform/layouts/RouteLayouts/MainRouteLayout/MainRouteLayout.ios';
import { GlobalHeader, Sidebar, TabBar } from '@platform/components';
import { useShellBanners } from '@hooks';
import { useAuthGuard } from '@navigation/guards';
import useMainRouteLayoutNative from '@platform/layouts/RouteLayouts/MainRouteLayout/useMainRouteLayoutNative';
import useMainRouteLayoutWeb from '@platform/layouts/RouteLayouts/MainRouteLayout/useMainRouteLayoutWeb';
import { AppFrame } from '@platform/layouts';

const mockEnTranslations = require('@i18n/locales/en.json');

jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => {
      const keys = key.split('.');
      let value = mockEnTranslations;
      for (const token of keys) {
        value = value?.[token];
        if (value === undefined) {
          return key;
        }
      }
      return value || key;
    },
    locale: 'en',
  }),
  useShellBanners: jest.fn(() => []),
}));

jest.mock('@navigation/guards', () => ({
  useAuthGuard: jest.fn(),
}));

jest.mock('@platform/layouts/RouteLayouts/MainRouteLayout/useMainLayoutMemo', () => ({
  useHeaderActions: jest.fn((authHeaderActions) => [
    ...authHeaderActions,
    { id: 'toggle-sidebar', label: 'Toggle Sidebar', onPress: jest.fn() },
  ]),
}));

jest.mock('@platform/layouts/common/useBreadcrumbs', () => jest.fn(() => []));
jest.mock('@platform/layouts/RouteLayouts/MainRouteLayout/useBreadcrumbs', () => jest.fn(() => []));

jest.mock('@platform/layouts/RouteLayouts/MainRouteLayout/useMainRouteLayoutNative', () => jest.fn());
jest.mock('@platform/layouts/RouteLayouts/MainRouteLayout/useMainRouteLayoutWeb', () => jest.fn());

jest.mock('@platform/layouts/RouteLayouts/MainRouteLayout/Brand', () => () => null);
jest.mock('@platform/layouts/RouteLayouts/MainRouteLayout/HamburgerIcon', () => () => null);
jest.mock('@platform/layouts/RouteLayouts/MainRouteLayout/HeaderUtility', () => () => null);
jest.mock('@platform/layouts/RouteLayouts/MainRouteLayout/MobileSidebar', () =>
  jest.fn(({ isOpen, onClose }) => (isOpen ? <div testID="mobile-sidebar" onClick={onClose} /> : null))
);

jest.mock('@platform/components/navigation/GlobalFooter', () => {
  const React = require('react');
  const GlobalFooter = ({ quickActionsSlot, testID }) => (
    <div testID={testID || 'main-footer'}>{quickActionsSlot || null}</div>
  );

  return {
    __esModule: true,
    default: GlobalFooter,
    FOOTER_VARIANTS: {
      MAIN: 'main',
      MINIMAL: 'minimal',
    },
  };
});

jest.mock('@platform/components', () => ({
  Breadcrumbs: jest.fn(({ testID }) => <div testID={testID || 'breadcrumbs'} />),
  GlobalHeader: jest.fn(({ accessibilityLabel, testID }) => (
    <div testID={testID} aria-label={accessibilityLabel} />
  )),
  Icon: jest.fn(() => <span />),
  LanguageControls: jest.fn(({ testID }) => <div testID={testID} />),
  NoticeSurface: jest.fn(({ testID }) => <div testID={testID} />),
  ShellBanners: jest.fn(({ testID }) => <div testID={testID} />),
  Sidebar: jest.fn(({ accessibilityLabel, testID }) => (
    <div testID={testID} aria-label={accessibilityLabel} />
  )),
  TabBar: jest.fn(({ accessibilityLabel, testID }) => (
    <div testID={testID} aria-label={accessibilityLabel} />
  )),
  ThemeControls: jest.fn(({ testID }) => <div testID={testID} />),
}));

jest.mock('@platform/layouts', () => ({
  AppFrame: jest.fn(({ children, header, sidebar, footer }) => (
    <div testID="app-frame">
      {header}
      {sidebar}
      {children}
      {footer}
    </div>
  )),
}));

jest.mock('expo-router', () => ({
  Slot: ({ testID }) => {
    const { View } = require('react-native');
    return <View testID={testID || 'slot'} />;
  },
  usePathname: jest.fn(() => '/dashboard'),
}));

const createNativeHookState = () => ({
  authHeaderActions: [{ id: 'logout', label: 'Logout', onPress: jest.fn() }],
  overlaySlot: null,
  mainItems: [{ id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'home-outline' }],
  isItemVisible: jest.fn(() => true),
  isMobileSidebarOpen: false,
  handleCloseMobileSidebar: jest.fn(),
  handleToggleSidebar: jest.fn(),
});

const createWebHookState = () => ({
  t: (key) => key,
  mainItems: [{ id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'home-outline' }],
  isItemVisible: jest.fn(() => true),
  overlaySlot: null,
  resolvedSidebarWidth: 260,
  isSidebarCollapsed: false,
  isMobile: false,
  isHeaderHidden: false,
  isMobileSidebarOpen: false,
  authHeaderActions: [],
  handleToggleSidebar: jest.fn(),
  handleShowHeader: jest.fn(),
  handleResizeStart: jest.fn(),
  handleResizeKeyDown: jest.fn(),
  handleMobileOverlayKeyDown: jest.fn(),
  closeButtonRef: { current: null },
  mobileSidebarRef: { current: null },
  footerVisible: true,
  handleCloseMobileSidebar: jest.fn(),
});

describe('Main layout navigation skeleton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useMainRouteLayoutNative.mockImplementation(() => {
      useAuthGuard();
      return createNativeHookState();
    });
    useMainRouteLayoutWeb.mockImplementation(() => {
      useAuthGuard();
      return createWebHookState();
    });
  });

  test('renders iOS header + tab bar + slot', () => {
    const { getByTestId } = render(<MainRouteLayoutIOS />);

    expect(GlobalHeader).toHaveBeenCalled();
    expect(TabBar).toHaveBeenCalled();
    expect(Sidebar).not.toHaveBeenCalled();
    expect(getByTestId('slot')).toBeDefined();
  });

  test('renders Android header + tab bar + slot', () => {
    const { getByTestId } = render(<MainRouteLayoutAndroid />);

    expect(GlobalHeader).toHaveBeenCalled();
    expect(TabBar).toHaveBeenCalled();
    expect(Sidebar).not.toHaveBeenCalled();
    expect(getByTestId('slot')).toBeDefined();
  });

  test('renders Web sidebar + header + slot', () => {
    const { getByTestId } = render(<MainRouteLayoutWeb />);

    expect(Sidebar).toHaveBeenCalled();
    expect(GlobalHeader).toHaveBeenCalled();
    expect(TabBar).not.toHaveBeenCalled();
    expect(getByTestId('slot')).toBeDefined();
  });

  test('wires accessibility labels on iOS header and tab bar', () => {
    render(<MainRouteLayoutIOS />);

    const headerCall = GlobalHeader.mock.calls[0][0];
    const tabBarCall = TabBar.mock.calls[0][0];

    expect(headerCall).toMatchObject({
      accessibilityLabel: mockEnTranslations.navigation.header.title,
      testID: 'main-header',
    });
    expect(tabBarCall).toMatchObject({
      accessibilityLabel: mockEnTranslations.navigation.tabBar.title,
      testID: 'main-tabbar',
    });
  });

  test('wires accessibility labels on web sidebar', () => {
    render(<MainRouteLayoutWeb />);
    const sidebarCall = Sidebar.mock.calls[0][0];

    expect(sidebarCall).toMatchObject({
      accessibilityLabel: 'navigation.sidebar.title',
      testID: 'main-sidebar',
    });
  });

  test('calls auth guard before rendering navigation shells', () => {
    render(<MainRouteLayoutIOS />);
    render(<MainRouteLayoutAndroid />);
    render(<MainRouteLayoutWeb />);

    expect(useAuthGuard).toHaveBeenCalledTimes(4);
  });

  test('wires language and theme controls into tier-3 shell headers', () => {
    render(<MainRouteLayoutIOS />);
    render(<MainRouteLayoutAndroid />);
    render(<MainRouteLayoutWeb />);

    const utilityChildren = GlobalHeader.mock.calls.flatMap(([props]) =>
      React.Children.toArray(props.utilitySlot?.props?.children ?? [])
    );
    expect(utilityChildren.some((child) => child?.props?.testID === 'main-language-controls')).toBe(true);
    expect(utilityChildren.some((child) => child?.props?.testID === 'main-theme-controls')).toBe(true);
    expect(GlobalHeader.mock.calls[0][0].utilitySlot).toBeDefined();
    expect(GlobalHeader.mock.calls[1][0].utilitySlot).toBeDefined();
    expect(GlobalHeader.mock.calls[2][0].utilitySlot).toBeDefined();
  });

  test('renders shell banners when banner payload exists', () => {
    useShellBanners.mockReturnValue([
      { id: 'maintenance', variant: 'maintenance', title: 'Maintenance', message: 'Planned window' },
    ]);
    render(<MainRouteLayoutWeb />);

    const appFrameProps = AppFrame.mock.calls[0][0];
    expect(appFrameProps.banner).toBeTruthy();
    expect(appFrameProps.banner.props.testID).toBe('main-shell-banners');
  });

  test('renders shell banner for network status banners on web', () => {
    useShellBanners.mockReturnValue([
      { id: 'offline', variant: 'offline', title: 'Offline', message: 'Network unavailable' },
    ]);
    render(<MainRouteLayoutWeb />);

    const appFrameProps = AppFrame.mock.calls[0][0];
    expect(appFrameProps.banner).toBeTruthy();
    expect(appFrameProps.banner.props.testID).toBe('main-shell-banners');
  });

  test('passes notices and overlay slots into AppFrame', () => {
    useMainRouteLayoutWeb.mockImplementation(() => {
      useAuthGuard();
      return {
        ...createWebHookState(),
        overlaySlot: <div testID="main-overlay-slot" />,
      };
    });

    render(<MainRouteLayoutWeb />);

    const appFrameProps = AppFrame.mock.calls[0][0];
    expect(appFrameProps.overlay).toBeTruthy();
    expect(appFrameProps.notices).toBeTruthy();
    expect(appFrameProps.notices.props.testID).toBe('main-notice-surface');
  });
});
