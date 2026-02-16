/**
 * Facility Selection Route
 */
import { FacilitySelectionScreen } from '@platform/screens';
import withRouteTermsAcceptance from '../shared/withRouteTermsAcceptance';

function FacilitySelectionRoute() {
  return <FacilitySelectionScreen />;
}

export default withRouteTermsAcceptance(FacilitySelectionRoute, { screenKey: 'auth-facility-selection' });
