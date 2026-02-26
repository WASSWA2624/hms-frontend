import { ClinicalResourceListScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function WardRoundsListRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode=\"list\"
      resource=\"ward-rounds\"
      panel=\"rounds\"
      action=\"open_ward_rounds\"
      fallback={<ClinicalResourceListScreen resourceId=\"ward-rounds\" />}
    />
  );
}
