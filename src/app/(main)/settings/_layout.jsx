/**
 * Settings segment layout.
 * Renders SettingsScreen as template (sidebar + scrollable content) with Slot for sub-routes.
 * Per app-router.mdc: group layouts use _layout.jsx, default export.
 * Key Slot by pathname so nested routes (facilities, users, etc.) mount correctly when navigating from the sidebar.
 */
import { Slot, usePathname } from 'expo-router';
import { SettingsScreen } from '@platform/screens';
import { SETTINGS_SEGMENT_TO_TAB, SETTINGS_TABS } from '@platform/screens/settings/SettingsScreen/types';

const resolveScreenKey = (pathname = '') => {
  const parts = pathname.split('/').filter(Boolean);
  const lastPart = parts[parts.length - 1];

  if (!lastPart || lastPart === 'settings' || lastPart === 'general') {
    return SETTINGS_TABS.GENERAL;
  }

  if (lastPart === 'create' && parts.length >= 2) {
    const segment = parts[parts.length - 2];
    return SETTINGS_SEGMENT_TO_TAB[segment] ?? SETTINGS_TABS.GENERAL;
  }

  if (lastPart === 'edit' && parts.length >= 3) {
    const segment = parts[parts.length - 3];
    return SETTINGS_SEGMENT_TO_TAB[segment] ?? SETTINGS_TABS.GENERAL;
  }

  return SETTINGS_SEGMENT_TO_TAB[lastPart] ?? SETTINGS_TABS.GENERAL;
};

export default function SettingsLayoutRoute() {
  const pathname = usePathname();
  const screenKey = resolveScreenKey(pathname);

  return (
    <SettingsScreen screenKey={screenKey}>
      <Slot key={pathname} />
    </SettingsScreen>
  );
}
