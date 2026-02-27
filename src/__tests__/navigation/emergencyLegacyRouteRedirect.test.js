const React = require('react');
const { render, waitFor } = require('@testing-library/react-native');

const mockReplace = jest.fn();
const mockUseLocalSearchParams = jest.fn();
const mockResolveLegacyRoute = jest.fn();

jest.mock('@config/feature.flags', () => ({
  EMERGENCY_WORKBENCH_V1: true,
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

jest.mock('@hooks', () => ({
  useOpdFlow: () => ({
    resolveLegacyRoute: mockResolveLegacyRoute,
  }),
}));

jest.mock('@platform/components', () => ({
  LoadingSpinner: () => null,
}));

describe('emergencyLegacyRouteRedirect', () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockResolveLegacyRoute.mockReset();
    mockUseLocalSearchParams.mockReset();
  });

  it('maps legacy emergency detail routes to /emergency workbench context', async () => {
    mockUseLocalSearchParams.mockReturnValue({ id: 'DISP-1' });
    mockResolveLegacyRoute.mockResolvedValue({
      encounter_id: 'ENC-1009',
      emergency_case_id: 'EMC-1009',
      ambulance_id: 'AMB-1009',
      panel: 'dispatch',
      action: 'manage_dispatch',
      resource: 'ambulance-dispatches',
    });

    const EmergencyLegacyRouteRedirect =
      require('@navigation/emergencyLegacyRouteRedirect').default;

    render(
      React.createElement(EmergencyLegacyRouteRedirect, {
        mode: 'detail',
        resource: 'ambulance-dispatches',
        panel: 'dispatch',
        action: 'manage_dispatch',
        fallback: null,
      })
    );

    await waitFor(() => {
      expect(mockResolveLegacyRoute).toHaveBeenCalledWith(
        'ambulance-dispatches',
        'DISP-1'
      );
      expect(mockReplace).toHaveBeenCalledWith(
        '/emergency?id=ENC-1009&emergencyCaseId=EMC-1009&ambulanceId=AMB-1009&panel=dispatch&action=manage_dispatch&resource=ambulance-dispatches&legacyId=DISP-1'
      );
    });
  });

  it('maps list routes directly to /emergency with panel/action context', async () => {
    mockUseLocalSearchParams.mockReturnValue({});
    mockResolveLegacyRoute.mockResolvedValue(null);

    const EmergencyLegacyRouteRedirect =
      require('@navigation/emergencyLegacyRouteRedirect').default;

    render(
      React.createElement(EmergencyLegacyRouteRedirect, {
        mode: 'list',
        resource: 'emergency-responses',
        panel: 'responses',
        action: 'open_response_list',
        fallback: null,
      })
    );

    await waitFor(() => {
      expect(mockResolveLegacyRoute).not.toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith(
        '/emergency?panel=responses&action=open_response_list&resource=emergency-responses'
      );
    });
  });

  it('does not leak UUID values into emergency workbench query params', async () => {
    mockUseLocalSearchParams.mockReturnValue({
      id: '550e8400-e29b-41d4-a716-446655440000',
    });
    mockResolveLegacyRoute.mockResolvedValue({
      encounter_id: '550e8400-e29b-41d4-a716-446655440000',
      emergency_case_id: '550e8400-e29b-41d4-a716-446655440001',
      ambulance_id: '550e8400-e29b-41d4-a716-446655440002',
      panel: 'dispatch',
      action: 'manage_dispatch',
      resource: 'ambulance-dispatches',
    });

    const EmergencyLegacyRouteRedirect =
      require('@navigation/emergencyLegacyRouteRedirect').default;

    render(
      React.createElement(EmergencyLegacyRouteRedirect, {
        mode: 'detail',
        resource: 'ambulance-dispatches',
        panel: 'dispatch',
        action: 'manage_dispatch',
        fallback: null,
      })
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        '/emergency?panel=dispatch&action=manage_dispatch&resource=ambulance-dispatches'
      );
    });
  });
});
