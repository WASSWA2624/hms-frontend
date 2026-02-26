import { ClinicalResourceFormScreen } from '@platform/screens';
import TheatreLegacyRouteRedirect from '@navigation/theatreLegacyRouteRedirect';

export default function PostOpNotesCreateRoute() {
  return (
    <TheatreLegacyRouteRedirect
      mode="create"
      resource="post-op-notes"
      panel="post-op"
      action="create_post_op_note"
      fallback={<ClinicalResourceFormScreen resourceId="post-op-notes" />}
    />
  );
}
