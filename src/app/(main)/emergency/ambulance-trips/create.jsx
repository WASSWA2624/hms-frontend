import { ClinicalResourceFormScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function AmbulanceTripsCreateRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="create"
      resource="ambulance-trips"
      panel="trips"
      action="manage_trip"
      fallback={<ClinicalResourceFormScreen resourceId="ambulance-trips" />}
    />
  );
}
