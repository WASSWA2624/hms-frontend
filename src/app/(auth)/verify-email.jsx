/**
 * Verify Email Route
 */
import { VerifyEmailScreen } from '@platform/screens';
import withRouteTermsAcceptance from '../shared/withRouteTermsAcceptance';

function VerifyEmailRoute() {
  return <VerifyEmailScreen />;
}

export default withRouteTermsAcceptance(VerifyEmailRoute, { screenKey: 'auth-verify-email' });
