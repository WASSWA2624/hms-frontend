import { ClinicalResourceDetailScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function AdmissionsDetailRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode="detail"
      resource="admissions"
      panel="snapshot"
      action="open_admission"
      fallback={<ClinicalResourceDetailScreen resourceId="admissions" />}
    />
  );
}

