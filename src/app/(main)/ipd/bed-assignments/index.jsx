import { ClinicalResourceListScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function BedAssignmentsListRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode="list"
      resource="bed-assignments"
      panel="beds"
      action="open_bed_assignments"
      fallback={<ClinicalResourceListScreen resourceId="bed-assignments" />}
    />
  );
}

