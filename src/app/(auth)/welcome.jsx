/**
 * Welcome Entry Route
 */
import { WelcomeEntryScreen } from '@platform/screens';
import withRouteTermsAcceptance from '../shared/withRouteTermsAcceptance';

function WelcomeRoute() {
  return <WelcomeEntryScreen />;
}

export default withRouteTermsAcceptance(WelcomeRoute, { screenKey: 'auth-welcome' });
