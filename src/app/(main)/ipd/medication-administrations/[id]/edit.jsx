import { ClinicalResourceFormScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function MedicationAdministrationsEditRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode="edit"
      resource="medication-administrations"
      panel="medication"
      action="update_medication"
      fallback={<ClinicalResourceFormScreen resourceId="medication-administrations" />}
    />
  );
}

