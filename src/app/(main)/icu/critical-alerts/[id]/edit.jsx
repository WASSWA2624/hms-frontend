import { ClinicalResourceFormScreen } from '@platform/screens';
import IcuLegacyRouteRedirect from '@navigation/icuLegacyRouteRedirect';

export default function CriticalAlertsEditRoute() {
  return (
    <IcuLegacyRouteRedirect
      mode="edit"
      resource="critical-alerts"
      panel="alerts"
      action="resolve_critical_alert"
      fallback={<ClinicalResourceFormScreen resourceId="critical-alerts" />}
    />
  );
}
