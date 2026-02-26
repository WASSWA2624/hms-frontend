import { ClinicalResourceFormScreen } from '@platform/screens';
import IcuLegacyRouteRedirect from '@navigation/icuLegacyRouteRedirect';

export default function CriticalAlertsCreateRoute() {
  return (
    <IcuLegacyRouteRedirect
      mode="create"
      resource="critical-alerts"
      panel="alerts"
      action="add_critical_alert"
      fallback={<ClinicalResourceFormScreen resourceId="critical-alerts" />}
    />
  );
}
