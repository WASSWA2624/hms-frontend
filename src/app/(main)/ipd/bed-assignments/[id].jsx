import { ClinicalResourceDetailScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function BedAssignmentsDetailRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode="detail"
      resource="bed-assignments"
      panel="beds"
      action="manage_bed"
      fallback={<ClinicalResourceDetailScreen resourceId="bed-assignments" />}
    />
  );
}

