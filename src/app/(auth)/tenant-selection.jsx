/**
 * Tenant Selection Route
 */
import { TenantSelectionScreen } from '@platform/screens';
import withRouteTermsAcceptance from '../shared/withRouteTermsAcceptance';

function TenantSelectionRoute() {
  return <TenantSelectionScreen />;
}

export default withRouteTermsAcceptance(TenantSelectionRoute, { screenKey: 'auth-tenant-selection' });
