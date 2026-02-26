import { ClinicalResourceDetailScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function MedicationAdministrationsDetailRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode="detail"
      resource="medication-administrations"
      panel="medication"
      action="add_medication"
      fallback={<ClinicalResourceDetailScreen resourceId="medication-administrations" />}
    />
  );
}

