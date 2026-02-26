const React = require('react');
const { render, waitFor } = require('@testing-library/react-native');

const mockReplace = jest.fn();
const mockUseLocalSearchParams = jest.fn();
const mockResolveLegacyRoute = jest.fn();

jest.mock('@config/feature.flags', () => ({
  ICU_WORKBENCH_V1: true,
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

jest.mock('@hooks', () => ({
  useIpdFlow: () => ({
    resolveLegacyRoute: mockResolveLegacyRoute,
  }),
}));

jest.mock('@platform/components', () => ({
  LoadingSpinner: () => null,
}));

describe('icuLegacyRouteRedirect', () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockResolveLegacyRoute.mockReset();
    mockUseLocalSearchParams.mockReset();
  });

  it('maps legacy ICU detail routes to /icu command center context', async () => {
    mockUseLocalSearchParams.mockReturnValue({ id: 'ICU-OBS-1' });
    mockResolveLegacyRoute.mockResolvedValue({
      admission_id: 'ADM-1009',
      panel: 'observations',
      action: 'open_icu_observation',
      resource: 'icu-observations',
    });

    const IcuLegacyRouteRedirect = require('@navigation/icuLegacyRouteRedirect').default;

    render(
      React.createElement(IcuLegacyRouteRedirect, {
        mode: 'detail',
        resource: 'icu-observations',
        panel: 'observations',
        action: 'open_icu_observation',
        fallback: null,
      })
    );

    await waitFor(() => {
      expect(mockResolveLegacyRoute).toHaveBeenCalledWith('icu-observations', 'ICU-OBS-1');
      expect(mockReplace).toHaveBeenCalledWith(
        '/icu?id=ADM-1009&panel=observations&action=open_icu_observation&resource=icu-observations&legacyId=ICU-OBS-1'
      );
    });
  });

  it('maps ICU list routes directly to /icu with panel/action context', async () => {
    mockUseLocalSearchParams.mockReturnValue({});
    mockResolveLegacyRoute.mockResolvedValue(null);

    const IcuLegacyRouteRedirect = require('@navigation/icuLegacyRouteRedirect').default;

    render(
      React.createElement(IcuLegacyRouteRedirect, {
        mode: 'list',
        resource: 'critical-alerts',
        panel: 'alerts',
        action: 'open_critical_alerts',
        fallback: null,
      })
    );

    await waitFor(() => {
      expect(mockResolveLegacyRoute).not.toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith(
        '/icu?panel=alerts&action=open_critical_alerts&resource=critical-alerts'
      );
    });
  });
});
