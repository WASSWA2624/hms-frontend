/**
 * Settings segment layout.
 * Renders SettingsScreen as template (sidebar + scrollable content) with Slot for sub-routes.
 * Per app-router.mdc: group layouts use _layout.jsx, default export.
 * Key Slot by pathname so nested routes (facilities, users, etc.) mount correctly when navigating from the sidebar.
 */
import { useRouteAccessGuard } from '@navigation/guards';
import { Slot, usePathname } from 'expo-router';
import { useI18n } from '@hooks';
import { LoadingSpinner } from '@platform/components';
import { SettingsScreen } from '@platform/screens';
import resolveSettingsRouteContext from '@platform/screens/settings/SettingsScreen/routeContext';

export default function SettingsLayoutRoute() {
  const { t } = useI18n();
  const pathname = usePathname();
  const { hasAccess, isPending } = useRouteAccessGuard({ redirectPath: '/dashboard' });
  const { screenKey, screenMode } = resolveSettingsRouteContext(pathname);

  if (isPending) {
    return (
      <SettingsScreen screenKey={screenKey} screenMode={screenMode}>
        <LoadingSpinner
          accessibilityLabel={t('common.loading')}
          testID="settings-layout-loading"
        />
      </SettingsScreen>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return (
    <SettingsScreen screenKey={screenKey} screenMode={screenMode}>
      <Slot key={pathname} />
    </SettingsScreen>
  );
}
