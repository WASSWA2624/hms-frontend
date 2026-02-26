import { ClinicalResourceDetailScreen } from '@platform/screens';
import IcuLegacyRouteRedirect from '@navigation/icuLegacyRouteRedirect';

export default function CriticalAlertsDetailRoute() {
  return (
    <IcuLegacyRouteRedirect
      mode="detail"
      resource="critical-alerts"
      panel="alerts"
      action="open_critical_alert"
      fallback={<ClinicalResourceDetailScreen resourceId="critical-alerts" />}
    />
  );
}
