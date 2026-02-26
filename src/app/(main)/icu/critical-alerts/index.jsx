import { ClinicalResourceListScreen } from '@platform/screens';
import IcuLegacyRouteRedirect from '@navigation/icuLegacyRouteRedirect';

export default function CriticalAlertsListRoute() {
  return (
    <IcuLegacyRouteRedirect
      mode="list"
      resource="critical-alerts"
      panel="alerts"
      action="open_critical_alerts"
      fallback={<ClinicalResourceListScreen resourceId="critical-alerts" />}
    />
  );
}
