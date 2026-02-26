import { ClinicalResourceDetailScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function TransferRequestsDetailRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode="detail"
      resource="transfer-requests"
      panel="transfer"
      action="manage_transfer"
      fallback={<ClinicalResourceDetailScreen resourceId="transfer-requests" />}
    />
  );
}

