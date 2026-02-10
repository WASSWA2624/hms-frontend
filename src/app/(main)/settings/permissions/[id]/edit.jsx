/**
 * Permission Edit Route
 * (main)/settings/permissions/[id]/edit
 * Per app-router.mdc: lightweight page, delegate to platform screen
 */
import { PermissionFormScreen } from '@platform/screens';

export default function PermissionEditRoute() {
  return <PermissionFormScreen />;
}
