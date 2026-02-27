import { ClinicalResourceFormScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function AmbulanceTripsEditRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="edit"
      resource="ambulance-trips"
      panel="trips"
      action="update_trip"
      fallback={<ClinicalResourceFormScreen resourceId="ambulance-trips" />}
    />
  );
}
