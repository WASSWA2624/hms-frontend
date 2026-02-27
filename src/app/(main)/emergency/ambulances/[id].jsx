import { ClinicalResourceDetailScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function AmbulancesDetailRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="detail"
      resource="ambulances"
      panel="ambulance"
      action="open_ambulance"
      fallback={<ClinicalResourceDetailScreen resourceId="ambulances" />}
    />
  );
}
