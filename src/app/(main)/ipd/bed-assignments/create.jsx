import { ClinicalResourceFormScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function BedAssignmentsCreateRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode="create"
      resource="bed-assignments"
      panel="beds"
      action="assign_bed"
      fallback={<ClinicalResourceFormScreen resourceId="bed-assignments" />}
    />
  );
}

