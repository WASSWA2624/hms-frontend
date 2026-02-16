/**
 * Forgot Password Route
 */
import { ForgotPasswordScreen } from '@platform/screens';
import withRouteTermsAcceptance from '../shared/withRouteTermsAcceptance';

function ForgotPasswordRoute() {
  return <ForgotPasswordScreen />;
}

export default withRouteTermsAcceptance(ForgotPasswordRoute, { screenKey: 'auth-forgot-password' });
