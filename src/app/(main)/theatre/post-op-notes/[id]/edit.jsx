import { ClinicalResourceFormScreen } from '@platform/screens';
import TheatreLegacyRouteRedirect from '@navigation/theatreLegacyRouteRedirect';

export default function PostOpNotesEditRoute() {
  return (
    <TheatreLegacyRouteRedirect
      mode="edit"
      resource="post-op-notes"
      panel="post-op"
      action="update_post_op_note"
      fallback={<ClinicalResourceFormScreen resourceId="post-op-notes" />}
    />
  );
}
