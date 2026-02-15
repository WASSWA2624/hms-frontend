/**
 * useSidebar Hook Tests
 * File: useSidebar.test.js
 */
import { renderHook, act } from '@testing-library/react-native';
import useSidebar from '@platform/components/navigation/Sidebar/useSidebar';

let mockPathname = '/settings';

jest.mock('expo-router', () => ({
  usePathname: () => mockPathname,
}));

describe('useSidebar Hook', () => {
  const mockItems = [
    { id: 'settings', label: 'Settings', href: '/settings' },
    { id: 'users', label: 'Users', path: '/settings/users' },
    { id: 'hidden', label: 'Hidden', href: '/hidden' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = '/settings';
  });

  it('uses router pathname and exposes items by default', () => {
    const { result } = renderHook(() => useSidebar({ items: mockItems }));

    expect(result.current.pathname).toBe('/settings');
    expect(result.current.filteredItems).toHaveLength(3);
  });

  it('uses custom pathname when provided', () => {
    const { result } = renderHook(() =>
      useSidebar({ items: mockItems, pathname: '/settings/users' })
    );

    expect(result.current.pathname).toBe('/settings/users');
  });

  it('marks active item for exact and nested paths', () => {
    const { result } = renderHook(() =>
      useSidebar({ items: mockItems, pathname: '/settings/users/details' })
    );

    expect(result.current.isItemActive(mockItems[0])).toBe(true);
    expect(result.current.isItemActive(mockItems[1])).toBe(true);
  });

  it('returns false for items without href/path', () => {
    const { result } = renderHook(() => useSidebar({ items: [{}] }));

    expect(result.current.isItemActive({ id: 'no-link' })).toBe(false);
  });

  it('filters items with isItemVisible callback', () => {
    const isItemVisible = jest.fn((item) => item.id !== 'hidden');
    const { result } = renderHook(() =>
      useSidebar({ items: mockItems, isItemVisible })
    );

    expect(result.current.filteredItems).toHaveLength(2);
    expect(result.current.filteredItems.some((item) => item.id === 'hidden')).toBe(false);
  });

  it('returns empty filteredItems when items is not an array', () => {
    const { result } = renderHook(() => useSidebar({ items: null }));

    expect(result.current.filteredItems).toEqual([]);
  });

  it('toggles section expansion state', () => {
    const { result } = renderHook(() => useSidebar({ items: mockItems }));

    act(() => {
      result.current.toggleSection('group-1');
    });
    expect(result.current.expandedSections['group-1']).toBe(true);

    act(() => {
      result.current.toggleSection('group-1');
    });
    expect(result.current.expandedSections['group-1']).toBe(false);
  });

  it('prefers onItemPress callback over item.onPress', () => {
    const onItemPress = jest.fn();
    const itemOnPress = jest.fn();
    const item = { id: 'custom', href: '/custom', onPress: itemOnPress };
    const { result } = renderHook(() =>
      useSidebar({ items: [item], onItemPress })
    );

    act(() => {
      result.current.handleItemPress(item);
    });

    expect(onItemPress).toHaveBeenCalledWith(item);
    expect(itemOnPress).not.toHaveBeenCalled();
  });

  it('falls back to item.onPress when onItemPress is not provided', () => {
    const itemOnPress = jest.fn();
    const item = { id: 'fallback', href: '/fallback', onPress: itemOnPress };
    const { result } = renderHook(() => useSidebar({ items: [item] }));

    act(() => {
      result.current.handleItemPress(item);
    });

    expect(itemOnPress).toHaveBeenCalledWith(item);
  });

  it('handles item press gracefully when no handlers are provided', () => {
    const item = { id: 'no-handler', href: '/no-handler' };
    const { result } = renderHook(() => useSidebar({ items: [item] }));

    expect(() => {
      act(() => {
        result.current.handleItemPress(item);
      });
    }).not.toThrow();
  });

  it('supports default arguments', () => {
    const { result } = renderHook(() => useSidebar());

    expect(Array.isArray(result.current.filteredItems)).toBe(true);
    expect(typeof result.current.pathname).toBe('string');
  });

  it('maps sidebarMenu href from path and fallback href', () => {
    jest.resetModules();

    jest.isolateModules(() => {
      jest.doMock('@config/sideMenu', () => ({
        MAIN_NAV_ITEMS: [],
        SIDE_MENU_ITEMS: [
          { id: 'from-path', icon: 'A', path: '/from-path' },
          { id: 'from-href', icon: 'B', href: '/from-href' },
        ],
      }));

      const sidebarModule = require('@platform/components/navigation/Sidebar/useSidebar');
      expect(sidebarModule.sidebarMenu).toEqual([
        { id: 'from-path', icon: 'A', href: '/from-path' },
        { id: 'from-href', icon: 'B', href: '/from-href' },
      ]);

      jest.dontMock('@config/sideMenu');
    });

    jest.resetModules();
  });
});
