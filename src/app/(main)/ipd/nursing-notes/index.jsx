import { ClinicalResourceListScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function NursingNotesListRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode=\"list\"
      resource=\"nursing-notes\"
      panel=\"nursing\"
      action=\"open_nursing_notes\"
      fallback={<ClinicalResourceListScreen resourceId=\"nursing-notes\" />}
    />
  );
}
