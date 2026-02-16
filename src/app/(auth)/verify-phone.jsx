/**
 * Verify Phone Route
 */
import { VerifyPhoneScreen } from '@platform/screens';
import withRouteTermsAcceptance from '../shared/withRouteTermsAcceptance';

function VerifyPhoneRoute() {
  return <VerifyPhoneScreen />;
}

export default withRouteTermsAcceptance(VerifyPhoneRoute, { screenKey: 'auth-verify-phone' });
