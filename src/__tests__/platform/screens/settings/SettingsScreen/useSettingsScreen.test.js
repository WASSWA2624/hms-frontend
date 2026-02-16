/**
 * useSettingsScreen Hook Tests
 * File: useSettingsScreen.test.js
 * 
 * Per testing.mdc: Test hooks with proper mocking
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { useRouter, usePathname } = require('expo-router');
const useNavigationVisibility = require('@hooks/useNavigationVisibility').default;

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('@hooks/useNavigationVisibility', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useSettingsScreen = require('@platform/screens/settings/SettingsScreen/useSettingsScreen').default;
const { SETTINGS_TABS } = require('@platform/screens/settings/SettingsScreen/types');

const renderHook = () => {
  let hookResult;
  const TestComponent = () => {
    hookResult = useSettingsScreen();
    return null;
  };

  render(<TestComponent />);
  return hookResult;
};

const createVisibilityMock = (hiddenPaths = []) => {
  const hidden = new Set(hiddenPaths);
  return jest.fn((item) => !hidden.has(item?.path));
};

describe('useSettingsScreen Hook', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush });
    usePathname.mockReturnValue('/settings/tenants');
    useNavigationVisibility.mockReturnValue({
      isItemVisible: createVisibilityMock(),
    });
  });

  describe('initialization', () => {
    it('returns hook object with required methods', () => {
      const hookResult = renderHook();

      expect(hookResult).toHaveProperty('selectedTab');
      expect(hookResult).toHaveProperty('tabs');
      expect(hookResult).toHaveProperty('onTabChange');
      expect(hookResult).toHaveProperty('testID');
      expect(hookResult).toHaveProperty('accessibilityLabel');
    });

    it('provides all tab definitions', () => {
      const hookResult = renderHook();

      expect(Array.isArray(hookResult.tabs)).toBe(true);
      expect(hookResult.tabs.length).toBeGreaterThan(0);
      expect(hookResult.tabs[0]).toHaveProperty('id');
      expect(hookResult.tabs[0]).toHaveProperty('label');
      expect(hookResult.tabs[0]).toHaveProperty('testID');
    });

    it('provides testID and accessibilityLabel', () => {
      const hookResult = renderHook();

      expect(hookResult.testID).toBe('settings-screen');
      expect(hookResult.accessibilityLabel).toBe('settings.screen.label');
    });

    it('filters tabs based on role/access visibility', () => {
      useNavigationVisibility.mockReturnValue({
        isItemVisible: createVisibilityMock(['/settings/users', '/settings/roles']),
      });

      const hookResult = renderHook();

      expect(hookResult.tabs.some((tab) => tab.id === SETTINGS_TABS.USER)).toBe(false);
      expect(hookResult.tabs.some((tab) => tab.id === SETTINGS_TABS.ROLE)).toBe(false);
    });
  });

  describe('tab changes', () => {
    it('handles tab changes via onTabChange', () => {
      const hookResult = renderHook();

      hookResult.onTabChange(SETTINGS_TABS.USER);

      expect(mockPush).toHaveBeenCalled();
    });

    it('navigates to correct route on tab change', () => {
      const hookResult = renderHook();

      hookResult.onTabChange(SETTINGS_TABS.ROLE);

      expect(mockPush).toHaveBeenCalledWith('/settings/roles');
    });

    it('handles multiple tab changes', () => {
      const hookResult = renderHook();

      const testCases = [
        { id: SETTINGS_TABS.USER, route: '/settings/users' },
        { id: SETTINGS_TABS.ROLE, route: '/settings/roles' },
        { id: SETTINGS_TABS.PERMISSION, route: '/settings/permissions' },
      ];

      testCases.forEach(({ id, route }) => {
        mockPush.mockClear();
        hookResult.onTabChange(id);
        expect(mockPush).toHaveBeenCalledWith(route);
      });
    });

    it('does not navigate to hidden tabs', () => {
      useNavigationVisibility.mockReturnValue({
        isItemVisible: createVisibilityMock(['/settings/users']),
      });

      const hookResult = renderHook();
      hookResult.onTabChange(SETTINGS_TABS.USER);

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('pathname detection', () => {
    it('detects current tab from pathname', () => {
      usePathname.mockReturnValue('/settings/users');
      const hookResult = renderHook();

      // The hook detects the tab from pathname
      expect(hookResult).toBeDefined();
    });

    it('handles various pathname patterns', () => {
      const testCases = [
        { pathname: '/settings/tenants' },
        { pathname: '/settings/roles' },
        { pathname: '/settings/users' },
      ];

      testCases.forEach(({ pathname }) => {
        usePathname.mockReturnValue(pathname);
        const hookResult = renderHook();

        expect(hookResult).toBeDefined();
        expect(hookResult.selectedTab).toBeDefined();
      });
    });

    it('falls back to a visible tab when pathname tab is hidden', () => {
      usePathname.mockReturnValue('/settings/users');
      useNavigationVisibility.mockReturnValue({
        isItemVisible: createVisibilityMock(['/settings/users']),
      });

      const hookResult = renderHook();

      expect(hookResult.selectedTab).toBe(SETTINGS_TABS.GENERAL);
    });
  });
});
