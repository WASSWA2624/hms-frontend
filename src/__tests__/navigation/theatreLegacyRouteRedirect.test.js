const React = require('react');
const { render, waitFor } = require('@testing-library/react-native');

const mockReplace = jest.fn();
const mockUseLocalSearchParams = jest.fn();
const mockResolveLegacyRoute = jest.fn();

jest.mock('@config/feature.flags', () => ({
  THEATRE_WORKBENCH_V1: true,
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

jest.mock('@hooks', () => ({
  useTheatreFlow: () => ({
    resolveLegacyRoute: mockResolveLegacyRoute,
  }),
}));

jest.mock('@platform/components', () => ({
  LoadingSpinner: () => null,
}));

describe('theatreLegacyRouteRedirect', () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockResolveLegacyRoute.mockReset();
    mockUseLocalSearchParams.mockReset();
  });

  it('maps legacy theatre detail routes to /theatre workbench context', async () => {
    mockUseLocalSearchParams.mockReturnValue({ id: 'ANR-100' });
    mockResolveLegacyRoute.mockResolvedValue({
      theatre_case_id: 'THC-1009',
      panel: 'anesthesia',
      action: 'open_anesthesia_record',
      resource: 'anesthesia-records',
    });

    const TheatreLegacyRouteRedirect =
      require('@navigation/theatreLegacyRouteRedirect').default;

    render(
      React.createElement(TheatreLegacyRouteRedirect, {
        mode: 'detail',
        resource: 'anesthesia-records',
        panel: 'anesthesia',
        action: 'open_anesthesia_record',
        fallback: null,
      })
    );

    await waitFor(() => {
      expect(mockResolveLegacyRoute).toHaveBeenCalledWith(
        'anesthesia-records',
        'ANR-100'
      );
      expect(mockReplace).toHaveBeenCalledWith(
        '/theatre?id=THC-1009&panel=anesthesia&action=open_anesthesia_record&resource=anesthesia-records&legacyId=ANR-100'
      );
    });
  });

  it('maps theatre list routes directly to /theatre with panel/action context', async () => {
    mockUseLocalSearchParams.mockReturnValue({});
    mockResolveLegacyRoute.mockResolvedValue(null);

    const TheatreLegacyRouteRedirect =
      require('@navigation/theatreLegacyRouteRedirect').default;

    render(
      React.createElement(TheatreLegacyRouteRedirect, {
        mode: 'list',
        resource: 'theatre-cases',
        panel: 'snapshot',
        action: 'open_theatre_case_list',
        fallback: null,
      })
    );

    await waitFor(() => {
      expect(mockResolveLegacyRoute).not.toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith(
        '/theatre?panel=snapshot&action=open_theatre_case_list&resource=theatre-cases'
      );
    });
  });
});
