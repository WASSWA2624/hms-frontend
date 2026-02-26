import { ClinicalResourceDetailScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function WardRoundsDetailRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode="detail"
      resource="ward-rounds"
      panel="rounds"
      action="add_ward_round"
      fallback={<ClinicalResourceDetailScreen resourceId="ward-rounds" />}
    />
  );
}

