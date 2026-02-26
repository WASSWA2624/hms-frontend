import { ClinicalResourceFormScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function AdmissionsEditRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode="edit"
      resource="admissions"
      panel="snapshot"
      action="update_admission"
      fallback={<ClinicalResourceFormScreen resourceId="admissions" />}
    />
  );
}

