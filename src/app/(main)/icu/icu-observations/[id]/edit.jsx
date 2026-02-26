import { ClinicalResourceFormScreen } from '@platform/screens';
import IcuLegacyRouteRedirect from '@navigation/icuLegacyRouteRedirect';

export default function IcuObservationsEditRoute() {
  return (
    <IcuLegacyRouteRedirect
      mode="edit"
      resource="icu-observations"
      panel="observations"
      action="update_icu_observation"
      fallback={<ClinicalResourceFormScreen resourceId="icu-observations" />}
    />
  );
}
