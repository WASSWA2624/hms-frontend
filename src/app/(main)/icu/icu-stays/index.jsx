import { ClinicalResourceListScreen } from '@platform/screens';
import IcuLegacyRouteRedirect from '@navigation/icuLegacyRouteRedirect';

export default function IcuStaysListRoute() {
  return (
    <IcuLegacyRouteRedirect
      mode="list"
      resource="icu-stays"
      panel="snapshot"
      action="open_icu_stays"
      fallback={<ClinicalResourceListScreen resourceId="icu-stays" />}
    />
  );
}
