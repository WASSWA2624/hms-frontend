/**
 * Settings segment layout.
 * Renders SettingsScreen as template (sidebar + scrollable content) with Slot for sub-routes.
 * Per app-router.mdc: group layouts use _layout.jsx, default export.
 */
import { Slot } from 'expo-router';
import { SettingsScreen } from '@platform/screens';

export default function SettingsLayoutRoute() {
  return (
    <SettingsScreen>
      <Slot />
    </SettingsScreen>
  );
}
