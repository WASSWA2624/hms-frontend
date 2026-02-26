import { ClinicalResourceFormScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function WardRoundsEditRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode="edit"
      resource="ward-rounds"
      panel="rounds"
      action="update_ward_round"
      fallback={<ClinicalResourceFormScreen resourceId="ward-rounds" />}
    />
  );
}

