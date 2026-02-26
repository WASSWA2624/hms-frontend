import { ClinicalResourceFormScreen } from '@platform/screens';
import IcuLegacyRouteRedirect from '@navigation/icuLegacyRouteRedirect';

export default function IcuObservationsCreateRoute() {
  return (
    <IcuLegacyRouteRedirect
      mode="create"
      resource="icu-observations"
      panel="observations"
      action="add_icu_observation"
      fallback={<ClinicalResourceFormScreen resourceId="icu-observations" />}
    />
  );
}
