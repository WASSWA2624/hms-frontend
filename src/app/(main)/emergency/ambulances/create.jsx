import { ClinicalResourceFormScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function AmbulancesCreateRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="create"
      resource="ambulances"
      panel="ambulance"
      action="add_ambulance"
      fallback={<ClinicalResourceFormScreen resourceId="ambulances" />}
    />
  );
}
