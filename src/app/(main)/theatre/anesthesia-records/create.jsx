import { ClinicalResourceFormScreen } from '@platform/screens';
import TheatreLegacyRouteRedirect from '@navigation/theatreLegacyRouteRedirect';

export default function AnesthesiaRecordsCreateRoute() {
  return (
    <TheatreLegacyRouteRedirect
      mode="create"
      resource="anesthesia-records"
      panel="anesthesia"
      action="create_anesthesia_record"
      fallback={<ClinicalResourceFormScreen resourceId="anesthesia-records" />}
    />
  );
}
