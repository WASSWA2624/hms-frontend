import { ClinicalResourceListScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function MedicationAdministrationsListRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode=\"list\"
      resource=\"medication-administrations\"
      panel=\"medication\"
      action=\"open_medication\"
      fallback={<ClinicalResourceListScreen resourceId=\"medication-administrations\" />}
    />
  );
}
