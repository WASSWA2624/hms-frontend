/**
 * Reset Password Route
 */
import { ResetPasswordScreen } from '@platform/screens';
import withRouteTermsAcceptance from '../shared/withRouteTermsAcceptance';

function ResetPasswordRoute() {
  return <ResetPasswordScreen />;
}

export default withRouteTermsAcceptance(ResetPasswordRoute, { screenKey: 'auth-reset-password' });
