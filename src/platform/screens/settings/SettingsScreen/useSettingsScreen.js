/**
 * useSettingsScreen Hook
 * File: useSettingsScreen.js
 *
 * Manages the Settings main screen logic including tab navigation
 * Per features-domain.mdc: Business logic separated from UI
 */

import { useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'expo-router';
import useNavigationVisibility from '@hooks/useNavigationVisibility';
import { MAIN_NAV_ITEMS } from '@config/sideMenu';
import {
  SETTINGS_TABS,
  SETTINGS_TAB_ORDER,
  SETTINGS_SIDEBAR_GROUPS,
  SETTINGS_TAB_ICONS,
  SETTINGS_TAB_ROUTES,
  SETTINGS_SEGMENT_TO_TAB,
} from './types';

const SETTINGS_NAV_ID = 'settings';

const buildTabModel = (tabKey) => ({
  id: tabKey,
  label: `settings.tabs.${tabKey}`,
  testID: `settings-tab-${tabKey}`,
  icon: SETTINGS_TAB_ICONS[tabKey] ?? null,
});

/**
 * useSettingsScreen hook
 * Manages Settings screen tab state and navigation
 * 
 * @returns {Object} Settings screen state and handlers
 */
const useSettingsScreen = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isItemVisible } = useNavigationVisibility();

  const settingsNavItem = useMemo(
    () => MAIN_NAV_ITEMS.find((item) => item?.id === SETTINGS_NAV_ID) ?? null,
    []
  );

  const visibleTabIds = useMemo(() => {
    if (!settingsNavItem || !isItemVisible(settingsNavItem)) return [];

    const visibleSettingsPaths = new Set(['/settings']);
    const children = Array.isArray(settingsNavItem.children) ? settingsNavItem.children : [];

    children.forEach((child) => {
      if (!isItemVisible(child)) return;
      const childPath = child?.path;
      if (typeof childPath === 'string' && childPath.startsWith('/settings')) {
        visibleSettingsPaths.add(childPath);
      }
    });

    return SETTINGS_TAB_ORDER.filter((tabId) => {
      const route = SETTINGS_TAB_ROUTES[tabId];
      return typeof route === 'string' && visibleSettingsPaths.has(route);
    });
  }, [isItemVisible, settingsNavItem]);

  const visibleTabSet = useMemo(() => new Set(visibleTabIds), [visibleTabIds]);

  // Extract current tab from pathname
  // E.g., /settings/users -> USER; /settings/tenants/create -> TENANT; /settings/facilities/[id]/edit -> FACILITY
  const getCurrentTab = useCallback(() => {
    const parts = pathname.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1];

    if (lastPart === 'create' && parts.length >= 2) {
      const segment = parts[parts.length - 2];
      return SETTINGS_SEGMENT_TO_TAB[segment] ?? SETTINGS_TABS.GENERAL;
    }
    if (lastPart === 'edit' && parts.length >= 3) {
      const segment = parts[parts.length - 3];
      return SETTINGS_SEGMENT_TO_TAB[segment] ?? SETTINGS_TABS.GENERAL;
    }

    const tabMap = {
      '': SETTINGS_TABS.GENERAL,
      'general': SETTINGS_TABS.GENERAL,
      'settings': SETTINGS_TABS.GENERAL,
      ...SETTINGS_SEGMENT_TO_TAB,
    };
    return tabMap[lastPart] ?? SETTINGS_TABS.GENERAL;
  }, [pathname]);

  const fallbackTab = visibleTabIds[0] ?? SETTINGS_TABS.GENERAL;
  const detectedTab = getCurrentTab();
  const selectedTab = visibleTabSet.has(detectedTab) ? detectedTab : fallbackTab;
  const currentTabId = selectedTab;

  const tabs = useMemo(() => visibleTabIds.map(buildTabModel), [visibleTabIds]);

  const groupedTabs = useMemo(
    () =>
      SETTINGS_SIDEBAR_GROUPS.map((group) => ({
        id: group.id,
        labelKey: group.labelKey,
        tabs: group.tabs.filter((tabId) => visibleTabSet.has(tabId)).map(buildTabModel),
      })).filter((group) => group.tabs.length > 0),
    [visibleTabSet]
  );

  const handleTabChange = useCallback((tabId) => {
    const route = SETTINGS_TAB_ROUTES[tabId];
    if (route && visibleTabSet.has(tabId)) {
      router.push(route);
    }
  }, [router, visibleTabSet]);

  return {
    selectedTab,
    currentTabId,
    tabs,
    groupedTabs,
    visibleTabIds,
    onTabChange: handleTabChange,
    testID: 'settings-screen',
    accessibilityLabel: 'settings.screen.label',
  };
};

export default useSettingsScreen;
