import { ClinicalResourceDetailScreen } from '@platform/screens';
import IcuLegacyRouteRedirect from '@navigation/icuLegacyRouteRedirect';

export default function IcuStaysDetailRoute() {
  return (
    <IcuLegacyRouteRedirect
      mode="detail"
      resource="icu-stays"
      panel="snapshot"
      action="open_icu_stay"
      fallback={<ClinicalResourceDetailScreen resourceId="icu-stays" />}
    />
  );
}
