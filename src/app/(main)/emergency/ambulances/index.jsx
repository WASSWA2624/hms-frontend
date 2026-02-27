import { ClinicalResourceListScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function AmbulancesListRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="list"
      resource="ambulances"
      panel="ambulance"
      action="open_fleet"
      fallback={<ClinicalResourceListScreen resourceId="ambulances" />}
    />
  );
}
