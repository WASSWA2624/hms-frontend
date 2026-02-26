import { ClinicalResourceFormScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function TransferRequestsEditRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode="edit"
      resource="transfer-requests"
      panel="transfer"
      action="manage_transfer"
      fallback={<ClinicalResourceFormScreen resourceId="transfer-requests" />}
    />
  );
}

