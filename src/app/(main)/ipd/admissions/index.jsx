import { ClinicalResourceListScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function AdmissionsListRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode="list"
      resource="admissions"
      panel="snapshot"
      action="open_admission_list"
      fallback={<ClinicalResourceListScreen resourceId="admissions" />}
    />
  );
}

