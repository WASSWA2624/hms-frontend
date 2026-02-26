import { ClinicalResourceFormScreen } from '@platform/screens';
import TheatreLegacyRouteRedirect from '@navigation/theatreLegacyRouteRedirect';

export default function AnesthesiaRecordsEditRoute() {
  return (
    <TheatreLegacyRouteRedirect
      mode="edit"
      resource="anesthesia-records"
      panel="anesthesia"
      action="update_anesthesia_record"
      fallback={<ClinicalResourceFormScreen resourceId="anesthesia-records" />}
    />
  );
}
