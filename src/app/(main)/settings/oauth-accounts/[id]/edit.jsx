/**
 * OAuth Account Edit Route
 * (main)/settings/oauth-accounts/[id]/edit
 * Per app-router.mdc: lightweight page, delegate to platform screen
 */
import { OauthAccountFormScreen } from '@platform/screens';

export default function OauthAccountEditRoute() {
  return <OauthAccountFormScreen />;
}
