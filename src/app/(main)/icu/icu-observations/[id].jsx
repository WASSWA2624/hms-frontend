import { ClinicalResourceDetailScreen } from '@platform/screens';
import IcuLegacyRouteRedirect from '@navigation/icuLegacyRouteRedirect';

export default function IcuObservationsDetailRoute() {
  return (
    <IcuLegacyRouteRedirect
      mode="detail"
      resource="icu-observations"
      panel="observations"
      action="open_icu_observation"
      fallback={<ClinicalResourceDetailScreen resourceId="icu-observations" />}
    />
  );
}
