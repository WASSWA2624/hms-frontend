import { ClinicalResourceFormScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function AdmissionsCreateRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode=\"create\"
      resource=\"admissions\"
      panel=\"intake\"
      action=\"start_admission\"
      fallback={<ClinicalResourceFormScreen resourceId=\"admissions\" />}
    />
  );
}
