import { ClinicalResourceFormScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function TransferRequestsCreateRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode="create"
      resource="transfer-requests"
      panel="transfer"
      action="request_transfer"
      fallback={<ClinicalResourceFormScreen resourceId="transfer-requests" />}
    />
  );
}

