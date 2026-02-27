import { ClinicalResourceFormScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function AmbulancesEditRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="edit"
      resource="ambulances"
      panel="ambulance"
      action="update_ambulance"
      fallback={<ClinicalResourceFormScreen resourceId="ambulances" />}
    />
  );
}
