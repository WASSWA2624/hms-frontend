import { ClinicalResourceListScreen } from '@platform/screens';
import IcuLegacyRouteRedirect from '@navigation/icuLegacyRouteRedirect';

export default function IcuObservationsListRoute() {
  return (
    <IcuLegacyRouteRedirect
      mode="list"
      resource="icu-observations"
      panel="observations"
      action="open_icu_observations"
      fallback={<ClinicalResourceListScreen resourceId="icu-observations" />}
    />
  );
}
