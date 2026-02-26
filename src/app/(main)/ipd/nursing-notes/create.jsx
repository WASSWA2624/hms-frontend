import { ClinicalResourceFormScreen } from '@platform/screens';
import IpdLegacyRouteRedirect from '@navigation/ipdLegacyRouteRedirect';

export default function NursingNotesCreateRoute() {
  return (
    <IpdLegacyRouteRedirect
      mode="create"
      resource="nursing-notes"
      panel="nursing"
      action="add_nursing_note"
      fallback={<ClinicalResourceFormScreen resourceId="nursing-notes" />}
    />
  );
}

