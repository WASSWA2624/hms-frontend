import { ClinicalResourceFormScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function MedicationAdministrationsCreateRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode=\"create\"
      resource=\"medication-administrations\"
      panel=\"medication\"
      action=\"add_medication\"
      fallback={<ClinicalResourceFormScreen resourceId=\"medication-administrations\" />}
    />
  );
}
