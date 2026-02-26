import { ClinicalResourceFormScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function BedAssignmentsEditRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode="edit"
      resource="bed-assignments"
      panel="beds"
      action="manage_bed"
      fallback={<ClinicalResourceFormScreen resourceId="bed-assignments" />}
    />
  );
}

