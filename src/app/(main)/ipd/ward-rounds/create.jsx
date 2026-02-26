import { ClinicalResourceFormScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function WardRoundsCreateRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode="create"
      resource="ward-rounds"
      panel="rounds"
      action="add_ward_round"
      fallback={<ClinicalResourceFormScreen resourceId="ward-rounds" />}
    />
  );
}

