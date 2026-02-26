import { ClinicalResourceListScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function TransferRequestsListRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode="list"
      resource="transfer-requests"
      panel="transfer"
      action="open_transfer"
      fallback={<ClinicalResourceListScreen resourceId="transfer-requests" />}
    />
  );
}

