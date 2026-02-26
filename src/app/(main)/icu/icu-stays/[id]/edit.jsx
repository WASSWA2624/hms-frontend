import { ClinicalResourceFormScreen } from '@platform/screens';
import IcuLegacyRouteRedirect from '@navigation/icuLegacyRouteRedirect';

export default function IcuStaysEditRoute() {
  return (
    <IcuLegacyRouteRedirect
      mode="edit"
      resource="icu-stays"
      panel="stays"
      action="update_icu_stay"
      fallback={<ClinicalResourceFormScreen resourceId="icu-stays" />}
    />
  );
}
