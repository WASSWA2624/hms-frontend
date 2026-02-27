import { ClinicalResourceListScreen } from '@platform/screens';
import EmergencyLegacyRouteRedirect from '@navigation/emergencyLegacyRouteRedirect';

export default function AmbulanceTripsListRoute() {
  return (
    <EmergencyLegacyRouteRedirect
      mode="list"
      resource="ambulance-trips"
      panel="trips"
      action="open_trip_list"
      fallback={<ClinicalResourceListScreen resourceId="ambulance-trips" />}
    />
  );
}
