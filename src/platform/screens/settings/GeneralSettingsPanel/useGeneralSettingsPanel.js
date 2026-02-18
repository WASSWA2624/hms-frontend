/**
 * useGeneralSettingsPanel Hook
 * Shared state and handlers for GeneralSettingsPanel across platforms.
 */
import { useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { useNetwork, useResolvedRoles } from '@hooks';
import { selectFooterVisible } from '@store/selectors';
import { actions as uiActions } from '@store/slices/ui.slice';
import useSettingsScreen from '../SettingsScreen/useSettingsScreen';
import { SETTINGS_TABS } from '../SettingsScreen/types';

const SETTINGS_HOME_ROUTE = '/settings';
const DASHBOARD_ROUTE = '/dashboard';

const useGeneralSettingsPanel = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const footerVisible = useSelector(selectFooterVisible);
  const { isOffline } = useNetwork();
  const { isResolved } = useResolvedRoles();
  const { groupedTabs, selectedTab, onTabChange, visibleTabIds } = useSettingsScreen();

  const hasGeneralAccess = useMemo(
    () => visibleTabIds.includes(SETTINGS_TABS.GENERAL),
    [visibleTabIds]
  );

  const accessGroups = useMemo(
    () => groupedTabs.filter((group) => group.id !== 'general'),
    [groupedTabs]
  );

  const canManagePreferences = hasGeneralAccess;
  const isLoading = !isResolved;
  const hasError = !isLoading && !hasGeneralAccess;
  const isEmpty = !isLoading && !hasError && accessGroups.length === 0;

  const onFooterVisibleChange = useCallback(
    (value) => {
      if (!canManagePreferences) return;
      dispatch(uiActions.setFooterVisible(Boolean(value)));
    },
    [canManagePreferences, dispatch]
  );

  const onRetry = useCallback(() => {
    router.replace(SETTINGS_HOME_ROUTE);
  }, [router]);

  const onNavigateDashboard = useCallback(() => {
    router.replace(DASHBOARD_ROUTE);
  }, [router]);

  return {
    footerVisible,
    canManagePreferences,
    groupedTabs,
    accessGroups,
    selectedTab,
    onTabChange,
    isLoading,
    isOffline,
    hasError,
    isEmpty,
    errorMessageKey: 'settings.general.errors.accessDenied',
    onRetry,
    onNavigateDashboard,
    onFooterVisibleChange,
  };
};

export default useGeneralSettingsPanel;
