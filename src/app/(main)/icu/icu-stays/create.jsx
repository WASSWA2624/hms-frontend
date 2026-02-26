import { ClinicalResourceFormScreen } from '@platform/screens';
import IcuLegacyRouteRedirect from '@navigation/icuLegacyRouteRedirect';

export default function IcuStaysCreateRoute() {
  return (
    <IcuLegacyRouteRedirect
      mode="create"
      resource="icu-stays"
      panel="stays"
      action="start_icu_stay"
      fallback={<ClinicalResourceFormScreen resourceId="icu-stays" />}
    />
  );
}
